<template>
  <div type="text" contenteditable="plaintext-only" spellcheck="false"
    :class="className"
    :placeholder="placeholder"
    :id="id"
    :value="value"
    @input="$emit('input', $event)"
    @keydown="$emit('keydown', $event)"
    @focus="$emit('focus', $event)"
    @blur="$emit('blur', $event)">{{ value }}</div>
</template>

<script>
export default {
  name: 'ContentEditable',
  emits: [
    'input',
    'keydown',
    'focus',
    'blur',
  ],
  props: [
    'placeholder',
    'className',
    'id',
    'value',
  ],
};
</script>
