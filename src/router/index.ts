import { createRouter, createWebHistory } from 'vue-router';
import ThreeScene from '../components/ThreeScene.vue';
import PinkBear from '../components/PinkBear.vue';
import PurpleBear from '../components/PurpleBear.vue';
import DiamondBear from '../components/DiamondBear.vue';
import GlassBear from '../components/GlassBear.vue';
import BluePinkBear from '../components/BluePinkBear.vue';
import Transparent from '../components/HalfTransparentBear.vue';
import HalfBear from '../components/HalfBlueBear.vue';
import SliverBear from '../components/SliverBear.vue';
import MetalBear from '../components/MetalBear.vue';
import PopArtBear from '../components/PopartBear.vue';
import PopBear2 from '../components/PopBear2.vue';
import PopBear3 from '../components/PopArtBear3.vue';
import MetalMachineBear from '../components/MetalMachineBear.vue';
import WaterBear from '../components/WaterBear.vue';
import Water from '../components/Water.vue';
import GhostBear from '../components/GhostBear.vue';
import GhostBallonBear from '../components/GhostballonBear.vue';
import Santa from '../components/Santa.vue';
import Coffee from '../components/Aquar.vue';
import Bears from '../components/SliverBear.vue';
import Money from '../components/Money.vue';
import Snowman from '../components/Snowman.vue';
import Duck from '../components/Duck.vue';


const routes = [
    { path: '/3d-bear-arts/leather', name: 'Leather', component: MetalBear },
    { path: '/3d-bear-arts/pop-art', name: 'Pop', component: PopArtBear },
    // { path: '/3d-bear-arts/pop-art-bear', name: 'PopArtBear 2', component: PopBear2 },
    { path: '/3d-bear-arts/pop-art-bear-3', name: 'PopArtBear 3', component: PopBear3 },
    { path: '/3d-bear-arts/machine', name: 'MetalMachineBear', component: MetalMachineBear },
    { path: '/3d-bear-arts/water', name: 'Water', component: Water },
    { path: '/3d-bear-arts/ghost-bear', name: 'GhostBear', component: GhostBear },
    { path: '/3d-bear-arts/white-ghost-bear', name: 'GhostBallonBear', component: GhostBallonBear },
    { path: '/3d-bear-arts/coffee', name: 'Coffee', component: Coffee },
    { path: '/3d-bear-arts/bears', name: 'Bears', component: Bears },
    { path: '/3d-bear-arts/money', name: 'Money', component: Money },
    { path: '/3d-bear-arts/snowman', name: 'Snowman', component: Snowman },
    { path: '/3d-bear-arts/santa', name: 'Santa', component: Santa },
    { path: '/3d-bear-arts/', name: 'Duck', component: Duck },


    // { path: '/3d-bear-arts', name: 'ThreeScene', component: ThreeScene },
    // { path: '/3d-bear-arts/half', name: 'Haltransparent', component: HalfBear },
    // { path: '/3d-bear-arts/halfTransparent', name: 'Transparent', component: Transparent },
    // { path: '/3d-bear-arts/bluePink', name: 'BluePinkBear', component: BluePinkBear },
    // { path: '/3d-bear-arts/diamond', name: 'DiamondBear', component: DiamondBear },
    // { path: '/3d-bear-arts/pink', name: 'PinkBear', component: PinkBear },
    // { path: '/3d-bear-arts/purple', name: 'PurpleBear', component: PurpleBear },
    // { path: '/3d-bear-arts/glass', name: 'GlassBear', component: GlassBear },
];
const router = createRouter({
    history: createWebHistory(),
    routes,
});
export default router;
