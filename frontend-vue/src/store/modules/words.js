import "firebase/functions";
import "firebase/firestore";
import { firestoreAction } from "vuexfire";
import { app, firebase } from "../../shared/firebaseConfig";
const stem = (string) => string;
const db = app.firestore();
const Timestamp = firebase.firestore.Timestamp;
let functions = app.functions("europe-west1");

function matchTitle(title, searchTerm) {
  return title.indexOf(searchTerm) != -1;
}

function matchDefinition(word, stemmedTerm) {
  let matches = false;
  Object.entries(word.definition).forEach((entry) => {
    if (entry[0] !== "verb") {
      entry[1].forEach((definitionObject) => {
        if (definitionObject.text.indexOf(stemmedTerm) != -1) {
          matches = true;
        }
      });
    } else {
      if (entry[1].transitive) {
        entry[1].transitive.forEach((definitionObject) => {
          if (definitionObject.text.indexOf(stemmedTerm) != -1) {
            matches = true;
          }
        });
      }
      if (entry[1].intransitive) {
        entry[1].intransitive.forEach((definitionObject) => {
          if (definitionObject.text.indexOf(stemmedTerm) != -1) {
            matches = true;
          }
        });
      }
    }
  });
  return matches;
}

function getDatabasePath(collection) {
  //const collectionArray = [];
  collection = collection.replace(/^\/+|\/+$/g, "");
  const tokens = collection.split("/");
  if (tokens[0] == "words") tokens.splice(0, 1, "collections", "default");
  /* collection.split("/").forEach((collection, index, array) => {
        if (index == 0 && collection == "Words") {
            collectionArray.push("Collections");
        } else if (index < array.length - 1) {
            collectionArray.push(...[collection, "Collections"]);
        } else {
            collectionArray.push(...[collection]);
        }
    }); */
  return collection;
}
//UTIL FUNCTIONS END HERE!!

const state = {
  Words: {
    words: [],
  },
  words: [],
  collections: [],
  searchResults: [],
  searching: false,
  currentCollection: {
    name: "",
    path: "",
  },
  archivedWords: [],
  wordsBound: false,
  collectionsBound: false,
};

const getters = {
  getWords: (state) => {
    return state.searching ? state.searchResults : state.words;
  },
  getCollections: (state) => {
    return state.collections;
  },
  getBound: (state) => (item) => state[`${item}Bound`],
  getWordsBound: (state) => state.wordsBound,
  getArchivedWords: (state) => state.archivedWords,
  getSearching: (state) => Boolean(state.searchTerm),
  getSearchTerm: (state) => state.searchTerm,
  getCurrentCollection: (state) => state.currentCollection,
};

const actions = {
  async addWord(_, wordTitle) {
    if (state.words.find((wordObject) => wordObject.title == wordTitle) !== undefined) {
      throw Error(`The word '${wordTitle}' has already been added`);
    }
    let addWord = functions.httpsCallable("addWord");
    try {
      const timeStamp = Timestamp.fromDate(new Date());
      await addWord({
        collection: state.currentCollection.path,
        wordTitle: wordTitle,
        timeStamp: timeStamp,
      });
    } catch (error) {
      console.log(error.code, error.message);
      throw error;
    }
  },

  removeWord: firestoreAction((context, deleteData) => {
    db.collection(
      `/users/${context.rootState.auth.user.uid}/${getDatabasePath(
        deleteData.collection.replace(/^\/+|\/+$/g, "")
      )}/words`
    )
      .doc(deleteData.word.id)
      .delete();
  }),
  async archiveWord(_, word) {
    const transferData = {
      to: "Archived",
      from: "Default",
    };
    const transferWord = functions.httpsCallable("transferWord");
    try {
      const timeStamp = Timestamp.fromDate(new Date());
      await transferWord({
        transferData,
        wordID: word.id,
        timeStamp,
      });
    } catch (error) {
      console.log(error.code, error.message);
      throw error;
    }
  },

  async unarchiveWord(_, word) {
    const transferData = {
      to: "Default",
      from: "Archived",
    };
    const transferWord = functions.httpsCallable("transferWord");
    try {
      const timeStamp = Timestamp.fromDate(new Date());
      await transferWord({
        transferData,
        wordID: word.id,
        timeStamp,
      });
    } catch (error) {
      console.log(error.code, error.message);
      throw error;
    }
  },
  async addCollection({ rootState }, title) {
    await db.doc(`/users/${rootState.auth.user.uid}/${getDatabasePath(state.currentCollection.path)}/${title}`).set({
      title,
      timeStamp: Timestamp.fromDate(new Date()),
    });
  },
  async removeCollection({ rootState }, title) {
    await db.doc(`/users/${rootState.auth.user.uid}/${getDatabasePath(state.currentCollection.path)}/${title}`).delete();
  },
  async batchAdd(context, writeData) {
    const batch = db.batch();
    const words = writeData.words.reverse();
    const collection = writeData.collection;
    const collectionRef = db.collection(
      `/users/${context.rootState.auth.user.uid}/${collection.replace(/^\/+|\/+$/g, "")}/words`
    );
    for (let word of words) {
      if (!state.words.find((stateWord) => word.title === stateWord.title)) {
        batch.set(collectionRef.doc(), {
          definition: word.definition,
          timeStamp: new Timestamp.fromDate(new Date()),
          title: word.title,
        });
      }
    }
    await batch.commit();
  },

  async bindCollection({ dispatch, commit, rootState }, collection) {
    commit("setCurrentCollection", {
      name: getDatabasePath(collection)
        .split("/")
        .reverse()[0],
      path: collection,
    });
    if (collection !== "/collections") {
      const exists = (await db.doc(`/users/${rootState.auth.user.uid}/${getDatabasePath(collection)}/`).get()).exists;
      if (!exists) {
        await db.doc(`/users/${rootState.auth.user.uid}/${getDatabasePath(collection)}/`).set({
          title: getDatabasePath(collection)
            .split("/")
            .reverse()[0],
          timeStamp: Timestamp.fromDate(new Date()),
        });
      }
    }
    dispatch("bindCollectionsFire", getDatabasePath(collection));
    if (collection !== "/collections") {
      dispatch("bindWordsFire", getDatabasePath(collection));
    }
  },
  bindWordsFire: firestoreAction(async (context, collection) => {
    //context.commit("setWordsBound", false);
    context.commit("setWordsBound", false);
    const val = await context.bindFirestoreRef(
      "words",
      db.collection(`/users/${context.rootState.auth.user.uid}/${collection}/words`).orderBy("timeStamp", "desc")
    );
    context.commit("setWordsBound", true);

    return val;
  }),
  bindCollectionsFire: firestoreAction((context, collection) => {
    return context.bindFirestoreRef(
      "collections",
      db.collection(
        collection == "collections"
          ? `/users/${context.rootState.auth.user.uid}/collections`
          : `/users/${context.rootState.auth.user.uid}/${collection}/collections`
      ).orderBy("timeStamp", "desc")
    );
  }),
  async search(context, searchTerm) {
    const stemmedTerm = stem(searchTerm.toLowerCase());
    if (searchTerm !== "") {
      context.commit("setSearching", true);
      state.searchResults = state.words.filter((word) => {
        return (
          (context.rootState.settings.local.searchBy.title &&
            matchTitle(stem(word.title.toLowerCase()), stemmedTerm)) ||
          (context.rootState.settings.local.searchBy.content && matchDefinition(word, stemmedTerm))
        );
      });
    } else {
      context.commit("setSearching", false);
    }
  },
};

const mutations = {
  clearCollections: (state) => (state.collections = {}),
  setSearchTerm: (state, value) => (state.searchTerm = value),
  setWordsBound: (state, value) => {
    state.wordsBound = value;
  },
  setCurrentCollection: (state, collectionData) => {
    state.currentCollection = collectionData;
  },
  setSearching: (state, value) => (state.searching = value),
  setSearchResults: (state, value) => (state.setSearchResults = value),
};

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations,
};
