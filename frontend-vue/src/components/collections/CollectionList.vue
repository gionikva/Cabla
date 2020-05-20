<template>
    <div class='collection-list'>

    </div>
</template>

<script>
export default {
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