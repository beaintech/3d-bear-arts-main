import { ref, onMounted } from 'vue';
const { defineProps, defineSlots, defineEmits, defineExpose, defineModel, defineOptions, withDefaults, } = await import('vue');
const bearCanvas = ref(null);
const isHidden = ref(false); // Controls the visibility of the entire component
// Function to hide the entire component
const toggleComponent = () => {
    isHidden.value = true; // Hides the component when the button is clicked
};
onMounted(() => {
    const canvas = bearCanvas.value;
    if (canvas) {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight * 0.6;
        const ctx = canvas.getContext('2d');
        if (ctx) {
            const drawBearFace = () => {
                const centerX = canvas.width / 2;
                const centerY = canvas.height / 1.9;
                const faceRadius = canvas.height / 2.5;
                const strokeFaceRadius = canvas.height / 2.58;
                const earRadius = faceRadius * 0.45;
                const eyeRadius = faceRadius * 0.18;
                const snoutRadius = faceRadius * 0.3;
                const smallSnoutRadius = faceRadius * 0.275;
                const noseRadius = snoutRadius * 0.35;
                const smallNoseRadius = snoutRadius * 0.32;
                // Draw half of the bear's face with stroke style
                ctx.save();
                ctx.beginPath();
                ctx.rect(0, 0, canvas.width / 2, canvas.height); // Left half for stroke
                ctx.clip(); // Clip left half
                // Ears (Stroke)
                ctx.lineWidth = 15;
                ctx.strokeStyle = '#000000';
                ctx.beginPath();
                ctx.arc(centerX - faceRadius * 0.85, centerY - strokeFaceRadius * 0.8, earRadius, 0, Math.PI * 2, true); // Left ear
                ctx.stroke();
                ctx.beginPath();
                ctx.arc(centerX + faceRadius * 0.85, centerY - faceRadius * 0.8, earRadius, 0, Math.PI * 2, true); // Right ear
                ctx.stroke();
                // Head (Stroke)
                ctx.lineWidth = 15;
                ctx.beginPath();
                ctx.arc(centerX, centerY, strokeFaceRadius, 0, Math.PI * 2, true); // Circle for the head
                ctx.stroke();
                // Eyes (Stroke)
                ctx.lineWidth = 15;
                ctx.beginPath();
                ctx.arc(centerX - faceRadius * 0.4, centerY - faceRadius * 0.2, eyeRadius, 0, Math.PI * 2, true); // O eye
                ctx.stroke();
                ctx.beginPath();
                // X eye
                ctx.moveTo(centerX + faceRadius * 0.2, centerY - faceRadius * 0.3);
                ctx.lineTo(centerX + faceRadius * 0.5, centerY - faceRadius * 0.05);
                ctx.moveTo(centerX + faceRadius * 0.5, centerY - faceRadius * 0.3);
                ctx.lineTo(centerX + faceRadius * 0.2, centerY - faceRadius * 0.05);
                ctx.stroke();
                // Snout (Stroke)
                ctx.beginPath();
                ctx.ellipse(centerX, centerY + faceRadius * 0.4, smallSnoutRadius * 1.5, smallSnoutRadius, 0, 0, Math.PI * 2);
                ctx.stroke();
                ctx.beginPath();
                ctx.arc(centerX, centerY + faceRadius * 0.3, smallNoseRadius, 0, Math.PI * 2, true);
                ctx.stroke();
                ctx.restore();
                // Draw half of the bear's face with fill (colored) style
                ctx.save();
                ctx.beginPath();
                ctx.rect(canvas.width / 2, 0, canvas.width / 2, canvas.height); // Right half for color
                ctx.clip(); // Clip right half
                // Ears (Color)
                ctx.fillStyle = '#FF69B4'; // Pink color
                ctx.beginPath();
                ctx.arc(centerX - faceRadius * 0.85, centerY - faceRadius * 0.8, earRadius, 0, Math.PI * 2, true); // Left ear
                ctx.fill();
                ctx.beginPath();
                ctx.arc(centerX + faceRadius * 0.85, centerY - faceRadius * 0.8, earRadius, 0, Math.PI * 2, true); // Right ear
                ctx.fill();
                // Head (Color)
                ctx.beginPath();
                ctx.arc(centerX, centerY, faceRadius, 0, Math.PI * 2, true); // Circle for the head
                ctx.fill();
                // Eyes (Color)
                ctx.fillStyle = '#000000';
                ctx.beginPath();
                ctx.arc(centerX - faceRadius * 0.4, centerY - faceRadius * 0.2, eyeRadius, 0, Math.PI * 2, true); // O eye
                ctx.fill();
                ctx.lineWidth = 15;
                ctx.beginPath();
                // X eye
                ctx.moveTo(centerX + faceRadius * 0.2, centerY - faceRadius * 0.3);
                ctx.lineTo(centerX + faceRadius * 0.5, centerY - faceRadius * 0.05);
                ctx.moveTo(centerX + faceRadius * 0.5, centerY - faceRadius * 0.3);
                ctx.lineTo(centerX + faceRadius * 0.2, centerY - faceRadius * 0.05);
                ctx.strokeStyle = '#000000';
                ctx.stroke();
                // Snout (Color)
                ctx.fillStyle = '#F0E68C'; // Snout color
                ctx.beginPath();
                ctx.ellipse(centerX, centerY + faceRadius * 0.4, snoutRadius * 1.5, snoutRadius, 0, 0, Math.PI * 2);
                ctx.fill();
                ctx.fillStyle = '#000000'; // Nose color
                ctx.beginPath();
                ctx.arc(centerX, centerY + faceRadius * 0.3, noseRadius * 1.2, 0, Math.PI * 2, true);
                ctx.fill();
                ctx.restore();
            };
            drawBearFace();
        }
    }
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
    __VLS_styleScopedClasses['pixel-button'];
    // CSS variable injection 
    // CSS variable injection end 
    let __VLS_resolvedLocalAndGlobalComponents;
    if (!__VLS_ctx.isHidden) {
        __VLS_elementAsFunction(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({ ...{ class: ("bear-face-container") }, });
        __VLS_elementAsFunction(__VLS_intrinsicElements.canvas, __VLS_intrinsicElements.canvas)({ ref: ("bearCanvas"), });
        // @ts-ignore navigation for `const bearCanvas = ref()`
        __VLS_ctx.bearCanvas;
        __VLS_elementAsFunction(__VLS_intrinsicElements.button, __VLS_intrinsicElements.button)({ ...{ onClick: (__VLS_ctx.toggleComponent) }, ...{ class: ("pixel-button") }, });
    }
    __VLS_styleScopedClasses['bear-face-container'];
    __VLS_styleScopedClasses['pixel-button'];
    var __VLS_slots;
    var __VLS_inheritedAttrs;
    const __VLS_refs = {
        "bearCanvas": __VLS_nativeElements['canvas'],
    };
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
            bearCanvas: bearCanvas,
            isHidden: isHidden,
            toggleComponent: toggleComponent,
        };
    },
});
export default (await import('vue')).defineComponent({
    setup() {
        return {};
    },
});
;
