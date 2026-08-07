import { HiOutlineHeart, HiOutlineHome, HiOutlineSparkles } from 'react-icons/hi';

// Two destinations and a shelf. Charts and Artists are gone: rankings and
// browse-by-artist are catalogue metaphors, and this is a listening app.
export const links = [
  { name: 'Home', to: '/', icon: HiOutlineHome },
  { name: 'Everything', to: '/mood/everything', icon: HiOutlineSparkles },
  { name: 'Liked', to: '/liked', icon: HiOutlineHeart },
];
