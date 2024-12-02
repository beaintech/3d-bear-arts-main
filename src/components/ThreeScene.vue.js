import { ref, onMounted, onUnmounted } from 'vue';
import PinkBear from './PinkBear.vue';
import PurpleBear from './PurpleBear.vue';
import BlueBear from './BlueBear.vue';
import BearFace from './BearFace.vue';
import { isBigTablet, isBigMobile } from '../utils/window-size';
const { defineProps, defineSlots, defineEmits, defineExpose, defineModel, defineOptions, withDefaults, } = await import('vue');
const isBearFace = ref(true); // Controls which bear face is displayed
let switchInterval;
// Function to auto-toggle between BearFace and PixelBearFace
const toggleBearFace = () => {
    isBearFace.value = !isBearFace.value;
};
// Setup auto-switch interval
onMounted(() => {
    switchInterval = setInterval(() => {
        toggleBearFace();
    }, 3000); // Switch every 3 seconds
});
// Clear the interval when the component is unmounted
onUnmounted(() => {
    clearInterval(switchInterval);
});
const __VLS_fnComponent = (await import('vue')).defineComponent({});
;
let __VLS_functionalComponentProps;
function __VLS_template() {
    const __VLS_ctx = {};
    const __VLS_localComponents = {
        ...{},
        ...{},
        ...__VLS_ctx,
    };
    let __VLS_components;
    const __VLS_localDirectives = {
        ...{},
        ...__VLS_ctx,
    };
    let __VLS_directives;
    let __VLS_styleScopedClasses;
    // CSS variable injection 
    // CSS variable injection end 
    let __VLS_resolvedLocalAndGlobalComponents;
    __VLS_elementAsFunction(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({ ...{ class: ("flex") }, });
    // @ts-ignore
    [BearFace,];
    // @ts-ignore
    const __VLS_0 = __VLS_asFunctionalComponent(BearFace, new BearFace({ ...{ class: ("bear-background") }, }));
    const __VLS_1 = __VLS_0({ ...{ class: ("bear-background") }, }, ...__VLS_functionalComponentArgsRest(__VLS_0));
    // @ts-ignore
    [PinkBear,];
    // @ts-ignore
    const __VLS_5 = __VLS_asFunctionalComponent(PinkBear, new PinkBear({ background: ((true)), cameraPosition: ((__VLS_ctx.isBigMobile ? 13 : __VLS_ctx.isBigTablet ? 8 : 6)), bodyPosition: (({ x: -15, y: 0, z: 0 })), ...{ class: ("bear-page") }, }));
    const __VLS_6 = __VLS_5({ background: ((true)), cameraPosition: ((__VLS_ctx.isBigMobile ? 13 : __VLS_ctx.isBigTablet ? 8 : 6)), bodyPosition: (({ x: -15, y: 0, z: 0 })), ...{ class: ("bear-page") }, }, ...__VLS_functionalComponentArgsRest(__VLS_5));
    // @ts-ignore
    [PurpleBear,];
    // @ts-ignore
    const __VLS_10 = __VLS_asFunctionalComponent(PurpleBear, new PurpleBear({ background: ((true)), cameraPosition: ((__VLS_ctx.isBigMobile ? 10 : __VLS_ctx.isBigTablet ? 6 : 4)), bodyPosition: (({ x: -15, y: 0, z: 0 })), ...{ class: ("bear-page") }, }));
    const __VLS_11 = __VLS_10({ background: ((true)), cameraPosition: ((__VLS_ctx.isBigMobile ? 10 : __VLS_ctx.isBigTablet ? 6 : 4)), bodyPosition: (({ x: -15, y: 0, z: 0 })), ...{ class: ("bear-page") }, }, ...__VLS_functionalComponentArgsRest(__VLS_10));
    // @ts-ignore
    [BlueBear,];
    // @ts-ignore
    const __VLS_15 = __VLS_asFunctionalComponent(BlueBear, new BlueBear({ background: ((true)), cameraPosition: ((__VLS_ctx.isBigMobile ? 13 : __VLS_ctx.isBigTablet ? 8 : 6)), bodyPosition: (({ x: -18, y: 0, z: 0 })), ...{ class: ("bear-page") }, }));
    const __VLS_16 = __VLS_15({ background: ((true)), cameraPosition: ((__VLS_ctx.isBigMobile ? 13 : __VLS_ctx.isBigTablet ? 8 : 6)), bodyPosition: (({ x: -18, y: 0, z: 0 })), ...{ class: ("bear-page") }, }, ...__VLS_functionalComponentArgsRest(__VLS_15));
    __VLS_styleScopedClasses['flex'];
    __VLS_styleScopedClasses['bear-background'];
    __VLS_styleScopedClasses['bear-page'];
    __VLS_styleScopedClasses['bear-page'];
    __VLS_styleScopedClasses['bear-page'];
    var __VLS_slots;
    var __VLS_inheritedAttrs;
    const __VLS_refs = {};
    var $refs;
    return {
        slots: __VLS_slots,
        refs: $refs,
        attrs: {},
    };
}
;
const __VLS_self = (await import('vue')).defineComponent({
    setup() {
        return {
            PinkBear: PinkBear,
            PurpleBear: PurpleBear,
            BlueBear: BlueBear,
            BearFace: BearFace,
            isBigTablet: isBigTablet,
            isBigMobile: isBigMobile,
        };
    },
});
export default (await import('vue')).defineComponent({
    setup() {
        return {};
    },
});
;
