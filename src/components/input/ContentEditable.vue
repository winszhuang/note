<template>
  <div type="text" contenteditable="plaintext-only"
    :class="className"
    :placeholder="placeholder"
    :id="id"
    :value="value || ''"
    @input="$emit('input', $event)"
    @keydown="$emit('keydown', $event)"
    @keyup="$emit('keyup', $event)"
    @focus="$emit('focus', $event)"
    @blur="$emit('blur', $event)"
    @paste="$emit('paste', $event)"
    v-once>{{ value || '' }}</div>
</template>

<script>
export default {
  name: 'ContentEditable',
  emits: [
    'input',
    'keydown',
    'keyup',
    'focus',
    'blur',
    'paste',
  ],
  props: [
    'placeholder',
    'className',
    'id',
    'value',
  ],
};
</script>

<style lang="scss">

</style>
