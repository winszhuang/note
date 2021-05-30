<template>
    <div class="modal-mask" @click="closeModal($event)">
      <div class="modal-wrapper">

        <div class="modal-container" v-if="mode === 'component'">
          <slot name="component"></slot>
        </div>

        <div class="modal-container" v-else>
          <div class="modal-header">
            <slot name="header">
            </slot>
          </div>

          <div class="modal-body">
            <slot name="body"></slot>
          </div>

          <div class="modal-footer">
            <slot name="footer">
            </slot>
          </div>
        </div>
      </div>
    </div>
</template>

<script>
export default {
  name: 'Modal',
  props: ['mode', 'isBgStatic'],
  setup(props, { emit }) {
    const closeModal = (e) => {
      if (e.target.className === 'modal-wrapper' || e.target.className === 'modal-mask') emit('close');
    };

    return { closeModal };
  },
};
</script>

<style lang="scss" scoped>
@import '../style/color.scss';
.modal-mask {
  position: fixed;
  z-index: 999;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: table;
  transition: opacity 0.3s ease;
}

.modal-wrapper {
  margin-top: 10rem;
  // display: table-cell;
  // vertical-align: middle;
}

.modal-container {
  width: 500px;
  margin: 0px auto;
  // padding: 1rem;
  background-color: #fff;
  border-radius: .5rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.33);
  transition: all 0.3s ease;
  font-family: Helvetica, Arial, sans-serif;
  background: $alabaster;
}

.modal-header h3 {
  margin-top: 0;
  color: #42b983;
}

.modal-body {
  margin: 20px 0;
}

.modal-default-button {
  float: right;
}

.modal-enter-from, .modal-leave-to {
  opacity: 0;
}

.modal-enter-active .modal-container,
.modal-leave-active .modal-container {
  -webkit-transform: scale(1.1);
  transform: scale(1.1);
}

</style>
