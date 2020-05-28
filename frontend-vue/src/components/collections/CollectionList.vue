<template>
    <div class='collection-list'>
        <CollectionCard v-for='collection in collections' :collection='collection' :key='collection.title' />
    </div>
</template>

<script>
import CollectionCard from './CollectionCard';
export default {
    components:{
        CollectionCard
    },
    name: 'CollectionList',
    props: ['collections']
}
</script>

<style lang='scss' scoped>
    .collection-list{
        display: grid;
        grid-gap: 1rem;
        margin: 1rem;
        grid-template-columns: 1fr;
    }
</style>