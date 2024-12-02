import { ref, computed } from 'vue';
const isMobileRef = ref(window.matchMedia('only screen and (max-width: 475px)').matches);
const isBigMobileRef = ref(window.matchMedia('only screen and (max-width: 580px)').matches);
const isSmallTabletRef = ref(window.matchMedia('only screen and (max-width: 670px)').matches);
const isTabletRef = ref(window.matchMedia('only screen and (max-width: 768px)').matches);
const isBigTabletRef = ref(window.matchMedia('only screen and (max-width: 850px)').matches);
const isSmallLaptopRef = ref(window.matchMedia('only screen and (max-width: 1024px)').matches);
// Setup ResizeObserver to update reactive refs
const resizeObserver = new ResizeObserver(() => {
    isMobileRef.value = window.matchMedia('only screen and (max-width: 475px)').matches;
    isBigMobileRef.value = window.matchMedia('only screen and (max-width: 580px)').matches;
    isSmallTabletRef.value = window.matchMedia('only screen and (max-width: 670px)').matches;
    isTabletRef.value = window.matchMedia('only screen and (max-width: 768px)').matches;
    isBigTabletRef.value = window.matchMedia('only screen and (max-width: 850px)').matches;
    isSmallLaptopRef.value = window.matchMedia('only screen and (max-width: 1024px)').matches;
});
// dynamically updates when the browser window is resized or zoomed
resizeObserver.observe(document.documentElement);
// Export computed properties to access screen sizes
// avoid direct access to refs in multiple components can lead to unexpected behavior
// changes to ref values in one component can affect others
export const isMobile = computed(() => isMobileRef.value);
export const isBigMobile = computed(() => isBigMobileRef.value);
export const isTablet = computed(() => isTabletRef.value);
export const isSmallLaptop = computed(() => isSmallLaptopRef.value);
export const isSmallTablet = computed(() => isSmallTabletRef.value);
export const isBigTablet = computed(() => isBigTabletRef.value);
