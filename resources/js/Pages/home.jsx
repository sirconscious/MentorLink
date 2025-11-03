import BubbleMenu from "@/components/BubbleMenu"
export default function home() { 
  const items = [

  {

    label: 'home',

    href: '#',

    ariaLabel: 'Home',

    rotation: -8,

    hoverStyles: { bgColor: '#3b82f6', textColor: '#ffffff' }

  },

  {

    label: 'about',

    href: '#',

    ariaLabel: 'About',

    rotation: 8,

    hoverStyles: { bgColor: '#10b981', textColor: '#ffffff' }

  },

  {

    label: 'projects',

    href: '#',

    ariaLabel: 'Projects',

    rotation: 8,

    hoverStyles: { bgColor: '#f59e0b', textColor: '#ffffff' }

  },

  {

    label: 'blog',

    href: '#',

    ariaLabel: 'Blog',

    rotation: 8,

    hoverStyles: { bgColor: '#ef4444', textColor: '#ffffff' }

  },

  {

    label: 'contact',

    href: '#',

    ariaLabel: 'Contact',

    rotation: -8,

    hoverStyles: { bgColor: '#8b5cf6', textColor: '#ffffff' }

  }

];
  return (
    <div>
      <BubbleMenu

  logo={<span style={{ fontWeight: 700 }}>MentorLink</span>}

  items={items}

  menuAriaLabel="Toggle navigation"

  menuBg="#ffffff"

  menuContentColor="#111111"

  useFixedPosition={false}

  animationEase="back.out(1.5)"

  animationDuration={0.5}

  staggerDelay={0.12}

/>
   </div>
  )
}
