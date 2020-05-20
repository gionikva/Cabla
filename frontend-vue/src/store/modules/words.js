import 'firebase/functions'
import 'firebase/firestore'
import { firestoreAction } from 'vuexfire'
import { app, firebase } from '../../shared/firebaseConfig'
const stem = (string) => string;
const db = app.firestore();
const Timestamp = firebase.firestore.Timestamp;
let functions = app.functions('europe-west1');

function matchTitle(title, searchTerm) {
    return (title.indexOf(searchTerm) != -1);
}

function matchDefinition(word, stemmedTerm) {
    let matches = false;
    Object.entries(word.definition).forEach((entry) => {

        if (entry[0] !== 'verb') {
            entry[1].forEach((definitionObject) => {
                if (definitionObject.text.indexOf(stemmedTerm) != -1) {
                    matches = true;
                }
            })
        } else {
            if (entry[1].transitive) {
                entry[1].transitive.forEach((definitionObject) => {
                    if (definitionObject.text.indexOf(stemmedTerm) != -1) {
                        matches = true;
                    }
                })
            } if (entry[1].intransitive) {
                entry[1].intransitive.forEach((definitionObject) => {
                    if (definitionObject.text.indexOf(stemmedTerm) != -1) {
                        matches = true;
                    }
                })
            }
        }
    })
    return matches;
}

function getStatePath(collection) {
    const collectionArray = []
    collection = collection.replace(/^\/+|\/+$/g, '');
    collection.split('/').forEach((collection, index, array) => {
        if (index < array.length - 1) {
            collectionArray.push(...[collection, 'collections'])
        } else {
            collectionArray.push(...[collection])
        }
    })
    return collectionArray.join('.')
}

function getDatabasePath(collection) {
    const collectionArray = []
    collection = collection.replace(/^\/+|\/+$/g, '');
    collection.split('/').forEach((collection, index, array) => {
        if (index == 0 && collection == 'Words') {
            collectionArray.push('Collections')
        }
        else if (index < array.length - 1) {
            collectionArray.push(...[collection, 'Collections'])
        } else {
            collectionArray.push(...[collection])
        }
    })
    return collectionArray.join('/')
}
//UTIL FUNCTIONS END HERE!!

const state = {
    Words: {
        words: []
    }
    ,
    words: [],
    collections: [],
    searchTerm: "",

    archivedWords: [],
    wordsBound: false,
    collectionsBound: false
}

const getters = {
    getWords: (state, getters, rootState) => {
        getters
        let arr = state.words;
        if (state.searchTerm !== '') {
            const stemmedTerm = stem(state.searchTerm.toLowerCase())
            return arr.filter((word) => {
                return (rootState.settings.local.searchBy.title &&
                    matchTitle(stem(word.title.toLowerCase()), stemmedTerm))
                    ||
                    (rootState.settings.local.searchBy.content &&
                        matchDefinition(word, stemmedTerm))
            })
        } else {
            return arr
        }

    },
    getCollections: (state, getters, rootState) => {
        getters
        let arr = state.collections;
        if (state.searchTerm !== '') {
            const stemmedTerm = stem(state.searchTerm.toLowerCase())
            return arr.filter((collection) => {
                return (rootState.settings.local.searchBy.title &&
                    matchTitle(stem(collection.title.toLowerCase()), stemmedTerm))

            })
        } else {
            return arr
        }

    },
    getBound: (state) => (item) => state[`${item}Bound`],
    getWordsBound: (state) => state.wordsBound,
    getArchivedWords: (state) => state.archivedWords,
    getSearching: (state) => Boolean(state.searchTerm),
    getSearchTerm: (state) => state.searchTerm,
}

const actions = {

    async addWord(_, wordTitle) {
        if (state.words.find((wordObject) => wordObject.title == wordTitle) !== undefined) {
            throw Error(`The word '${wordTitle}' has already been added`)
        }
        let addWord = functions.httpsCallable('addWord');
        try {
            const timeStamp = Timestamp.fromDate(new Date());
            await addWord({
                wordTitle: wordTitle,
                timeStamp: timeStamp,
            });
        } catch (error) {
            console.log(error.code, error.message)
            throw error;
        }
    },
    removeWord: firestoreAction((context, deleteData) => {
        console.log(deleteData.collection);
        db.collection(`/users/${context.rootState.auth.user.uid}/${getDatabasePath(deleteData.collection)}/Words`)
            .doc(deleteData.word.id)
            .delete()
    }),
    async archiveWord(_, word) {
        console.log(word)
        const transferData = {
            to: 'Archived',
            from: 'Default'
        }
        const transferWord = functions.httpsCallable('transferWord');
        try {
            const timeStamp = Timestamp.fromDate(new Date());
            await transferWord({
                transferData,
                wordID: word.id,
                timeStamp,
            });
        } catch (error) {
            console.log(error.code, error.message)
            throw error;
        }
    },

    async unarchiveWord(_, word) {

        console.log(word)
        const transferData = {
            to: 'Default',
            from: 'Archived'
        }
        const transferWord = functions.httpsCallable('transferWord');
        try {
            const timeStamp = Timestamp.fromDate(new Date());
            await transferWord({
                transferData,
                wordID: word.id,
                timeStamp,
            });
        } catch (error) {
            console.log(error.code, error.message)
            throw error;
        }
    },
    bindWords: firestoreAction((context) => {
        return context.bindFirestoreRef('words', db.collection(`/users/${context.rootState.auth.user.uid}/Collections/Default/Words`).orderBy('timeStamp', 'desc'));
    }),
    async bindCollection({ dispatch }, collection) {
        dispatch('bindCollectionsFire', getDatabasePath(collection))
        dispatch('bindWordsFire', getDatabasePath(collection))

    },
    bindWordsFire: firestoreAction(async (context, collection) => {
        const val = await context.bindFirestoreRef('words', db.collection(`/users/${context.rootState.auth.user.uid}/${collection}/Words`).orderBy('timeStamp', 'desc'))
        context.commit("setWordsBound", true);
        return val
    }),
    bindCollectionsFire: firestoreAction((context, collection) => {
        return context.bindFirestoreRef('collections', db.collection(`/users/${context.rootState.auth.user.uid}/${collection}/Collections`).orderBy('timeStamp', 'desc'))
    }),
}

const mutations = {
    clearCollections: (state) => state.collections = {},
    setSearchTerm: (state, value) => state.searchTerm = value,
    setCollectionBound: (state, collection, value) => {
        eval(`state.${getStatePath(collection)}.bound = ${value}`)
    },
    setWordsBound: (state, value) => { state.wordsBound = value; console.log('Retreived words!', state.wordsBound) },
}

export default {
    namespaced: true,
    state,
    getters,
    actions,
    mutations
}