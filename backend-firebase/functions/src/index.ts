import * as functions from "firebase-functions";
import * as admin from "firebase-admin";
import axios from "axios";
import { key_wordnik, key_spell_check } from "./keys";
import { Word, organize } from "./utils";
admin.initializeApp();
//TODO: Implement methods spellchecked and fetchWordData in a new file called definitions.ts.
//Also, implement the oxford dictionaries api with pronounciation and add wordnik api pronounciations
export const transferWord = functions
  .region("europe-west1")
  .https.onCall(async (data, context) => {
    if (!context.auth) {
      throw new functions.https.HttpsError(
        "unauthenticated",
        "please sign in to access"
      );
    } else {
      interface TransferData {
        to: string;
        from: string;
      }

      try {
        const transferData: TransferData = data.transferData;
        const wordID: string = data.wordID;
        const db = admin.firestore();
        const fromCollection = `/users/${context.auth.uid}/Collections/${transferData.from}/Words`;
        const toCollection = `/users/${context.auth.uid}/Collections/${transferData.to}/Words`;
        const wordSnapshot = await db
          .collection(fromCollection)
          .doc(wordID)
          .get();
        const fetchedWord = Object(wordSnapshot.data());
        const toTransferWord: Word = {
          title: fetchedWord.title,
          definition: fetchedWord.definition,
          timeStamp: new admin.firestore.Timestamp(
            fetchedWord.timeStamp.seconds,
            fetchedWord.timeStamp.nanoseconds
          ),
        };

        if (typeof fetchedWord != undefined) {
          await db.collection(fromCollection).doc(wordID).delete();
          try {
            await db.collection(toCollection).add(toTransferWord);
          } catch (error) {
            console.log(error);
            throw new functions.https.HttpsError("unknown", error);
          }
        }

        return "success";
      } catch (error) {
        throw new functions.https.HttpsError("unknown", `${error}`);
      }
    }
  });

interface WordData {
  wordTitle: string;
  timeStamp: FirebaseFirestore.Timestamp | object;
}

export const addWord = functions
  .region("europe-west1")
  .https.onCall(async (wordData: WordData, context) => {
    if (!context.auth) {
      throw new functions.https.HttpsError(
        "unauthenticated",
        "please sign in to access"
      );
    } else {
      const options = {
        params: {
          limit: 200,
          includeRelated: false,
          sourceDictionaries: "all",
          useCanonical: false,
          includeTags: false,
          api_key: key_wordnik,
        },
      };
      try {
        let responseData: Array<any> = [];
        let addTitle: string = wordData.wordTitle;
        try {
          responseData = (
            await axios.get(
              `https://api.wordnik.com/v4/word.json/${wordData.wordTitle}/definitions`,
              options
            )
          ).data;
        } catch {
          try {
            const spellData = (
              await axios.get(
                "https://cabla-spellchecker.cognitiveservices.azure.com/bing/v7.0/spellcheck",
                {
                  params: {
                    text: addTitle,
                    mkt: "en-US",
                    mode: "proof",
                  },

                  headers: {
                    "Content-Type": "application/x-www-form-urlencoded",
                    "Ocp-Apim-Subscription-Key": key_spell_check,
                  },
                }
              )
            ).data;
            console.log("Response Data from Spell Checker:", spellData);
            const suggestedWord: string =
              spellData.flaggedTokens[0]["suggestions"][0].suggestion;

            addTitle = suggestedWord;
            responseData = (
              await axios.get(
                `https://api.wordnik.com/v4/word.json/${suggestedWord}/definitions`,
                options
              )
            ).data;
          } catch (error) {
            if (error.response?.status === 429) {
              throw new functions.https.HttpsError(
                "internal",
                `Too many requests`
              );
            } else {
              throw new functions.https.HttpsError(
                "not-found",
                `No defintions found for word '${wordData.wordTitle}'`
              );
            }
          }
        }
        const word: Word = organize(responseData, {
          wordTitle: addTitle,
          timeStamp: wordData.timeStamp,
        });
        await admin
          .firestore()
          .collection(`/users/${context.auth.uid}/Collections/Default/Words`)
          .add(word);
        return "successfully added";
      } catch (error) {
        throw new functions.https.HttpsError("not-found", `${error}`);
      }
    }
  });