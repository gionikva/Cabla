import Vue from 'vue';
import Vuetify from 'vuetify/lib';
import { light_blue as light, dark_blue as dark } from './vuetify/themes';
Vue.use(Vuetify);

export default new Vuetify({
    theme: {
        themes: {
            light,
            dark
        }
    }
});
