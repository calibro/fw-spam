<template>
  <div data-tippy-root>
    <div class="tippy-box" data-placement="top">
      <div class="tippy-content">
        {{item.hostname}}
      </div>
    </div>
</div>
</template>

<script>
import 'tippy.js/dist/tippy.css'

export default {
  name: 'ChartTooltip',
  props: ['item']
}
</script>

<style>

</style>