// Temporary db file to allow working on the frontend until communication
// between the backend is sorted out.

/* https://stackoverflow.com/a/31379050 */
const getRandomDate = (start, end, startHour, endHour) => {
  var date = new Date(+start + Math.random() * (end - start));
  var hour = startHour + Math.random() * (endHour - startHour) | 0;
  date.setHours(hour);
  return date;
}


const users = ['test-user-1', 'test-user-2', 'test-user-3'];
const date = new Date(2024, 0, 1);
const journalEntries = [ // ai generated
  "Rain lashes against the window, a rhythmic counterpoint to the silence within. Today, the world feels muted, washed in shades of grey. Was it the unexpected rejection, or the biting wind that stole my usual spark? Perhaps it's both. Words dance on the page, half-formed sentences reflecting the fog in my head. Yet, there's a quiet beauty in this stillness, a space for introspection. Like the earth after a storm, I sense a fertile ground beneath the surface, waiting to be nourished by reflection. Deep breaths, pen against paper, and maybe, just maybe, a sliver of understanding will bloom alongside the storm clouds.",
  "Sunlight streams through the leaves, painting dancing patterns on my desk. A symphony of birdsong fills the air, a gentle nudge to greet the day. Today, I woke with a lightness in my step, a melody humming in my heart. Inspiration flows like a babbling brook, words cascading onto the page, each one a vibrant splash of color. The world feels full of possibility, a canvas waiting to be filled with the dreams of my soul. Let the creativity flow, let the joy spill over, and paint a masterpiece with the brushstrokes of my spirit.",
  "The wind howls like a lonely wolf, sending shivers down my spine. The sky weeps, fat tears splattering against the windowpane. A melancholic mood settles over me, a reflection of the stormy world outside. But even amidst the grey, there's a quiet beauty. The rhythmic patter of rain creates a lullaby, and the wind whispers secrets through the trees. Perhaps this sadness is a necessary cleansing, a washing away of the old to make way for the new. I close my eyes, embrace the emotions, and let them flow freely, knowing that sunshine will follow the storm.",
  "Laughter erupts like fireworks, filling the room with warmth and light. Friends gather, their faces alight with joy, stories weaving a tapestry of shared experiences. Tonight, the world shrinks to the size of this cozy room, filled with the music of connection and the comfort of belonging. In these moments, time loses its grip, and all that matters is the present, the shared laughter, the unspoken bonds that tie us together. As the night fades, I carry the warmth of these connections close to my heart, a reminder that even in the vastness of the world, we are never truly alone.",
  "Silence hangs heavy in the air, broken only by the ticking of the clock. Today, the world feels vast and empty, a reflection of the hollowness within. Loneliness gnaws at the edges of my heart, a cold ache that numbs the senses. But even in the silence, there's a strength to be found. The quiet allows for introspection, a chance to confront the shadows and mend the broken pieces. With each deep breath, I gather the courage to face the emptiness, knowing that on the other side lies the potential for healing and growth.",
  // "Crisp autumn air nips at my cheeks, painting my breath in wispy clouds. Leaves crunch underfoot, auburn and gold tapestries carpeting the path ahead. Today, the world feels alive with change, a vibrant transition from summer's warmth to winter's chill. There's a bittersweet beauty in the letting go, a surrender to the inevitable cycle of nature. And yet, beneath the fallen leaves, life stirs, preparing for its winter slumber. Just like the earth, I too am embracing change, letting go of the old to make way for new beginnings.",
  // "Gleaming city lights paint the night sky, a million tiny stars in a concrete constellation. The hum of traffic creates a low-pitched lullaby, while distant laughter dances on the breeze. Tonight, the city feels electric, alive with possibility. Here, anonymity cloaks me, allowing me to be whoever I want to be. In this urban jungle, I lose myself and find myself simultaneously, a chameleon blending into the kaleidoscope of humanity. As the night deepens, I carry the city's energy within me, a spark of its endless potential.",
  // "The scent of pine needles fills the air, a crisp aroma that awakens the senses. Sunlight filters through the canopy, dappling the forest floor in emerald light. Today, I seek solace in nature's embrace, a refuge from the chaos of the world. Each step on the winding path is a mindful journey, a reconnection with the earth's heartbeat. The towering trees stand as silent sentinels, offering wisdom and grounding strength. As I breathe in the forest's symphony, I feel my worries melt away, replaced by a sense of peace and belonging.",
  // "Salty air whips my hair, the taste of freedom tangy on my tongue. Waves crash against the shore, a rhythmic song of power and resilience. Today, I stand at the edge of the unknown, the vast ocean mirroring the boundless possibilities within myself. Fear whispers its warnings, but the ocean's roar drowns them out. With each step onto the sand, I shed my inhibitions, embracing the thrill of the untamed. Like the ocean, I am ever-changing, ever-evolving, and in this immensity, I discover my own depth and strength.",
  // "The crackling fire casts warm shadows on the walls, a haven from the winter's chill. A book lies open on my lap, its pages filled with adventures yet to be experienced. Tonight, I curl up with the comfort of a good story, letting my imagination soar beyond the confines of my living room. With each turn of the page, I am transported to new worlds, meeting characters who become friends, their struggles and triumphs echoing my own. In this shared journey, I find solace, inspiration, and a reminder that even in the quiet moments, life can be an extraordinary adventure.",
  // "Sunlight spills through the window, painting my room in golden hues. Today, I wake with a heart brimming with gratitude. Simple things take on a new shine - the warmth of the morning sun, the chirping of birds outside, the delicious aroma of brewing coffee. These small joys weave a tapestry of happiness, reminding me of the abundance that surrounds me. With a grateful heart, I step into the day, ready to savor each precious moment.",
  // "Rain lashes against the window, mimicking the storm brewing within. A difficult task looms ahead, its complexity a daunting challenge. But instead of fear, I feel a spark of excitement. Challenges, like storms, bring the potential for growth and transformation. With focused determination, I gather my tools and dive into the unknown. Each obstacle overcome is a victory, each step forward a testament to my resilience.",
  // "Music thrums through my headphones, filling the room with vibrant energy. Inspiration strikes like a bolt of lightning, igniting my creative spirit. Words flow freely, colors dance on the canvas, melodies weave into existence. In this flow state, time melts away, replaced by a deep sense of purpose and joy. The act of creation itself becomes a reward, a journey of self-expression and exploration.",
  // "Laughter bursts forth, echoing through the cafe, a shared melody of friendship. Conversations weave a tapestry of shared experiences, dreams, and vulnerabilities. In these moments of connection, differences fade away, replaced by a profound sense of belonging. We may come from different walks of life, but the human thread that binds us transcends all boundaries. As the laughter fades, I carry the warmth of connection close to my heart, a reminder that we are not alone in this journey.",
  // "Candlelight flickers, casting soft shadows on the walls. A notebook lies open, inviting introspection. Today, I delve into the quiet corners of my mind, reflecting on the week's experiences. Victories are celebrated, mistakes acknowledged, lessons learned. This journey inward is not always easy, but it is necessary for growth. With each moment of self-reflection, I gain a clearer understanding of who I am and who I want to become.",
  // "Barefoot steps press into the cool earth, grounding me to the present moment. The forest hums with life, rustling leaves whispering secrets on the wind. Today, I seek solace in nature's embrace, a teacher of resilience and peace. The towering trees stand tall, weathering storms for centuries, reminding me of my own inner strength. The babbling brook flows onwards, ever-changing yet constant, mirroring the impermanence of life. As I immerse myself in nature's wisdom, I find clarity and perspective.",
  // "Dawn paints the sky in hues of rose and gold, the world bathed in a hushed stillness. This quietude, often mistaken for emptiness, holds immense power. In the absence of noise, the whispers of my soul become audible. Fear, doubt, and hope rise to the surface, each emotion demanding attention. By embracing this silence, I gain a deeper understanding of my inner landscape, a necessary step towards growth and transformation.",
  // "The bustling city street thrums with energy, a kaleidoscope of faces and stories. Today, I become a silent observer, my curiosity piqued by the lives unfolding around me. Each stranger I encounter carries a hidden universe within, filled with joys, struggles, and dreams. With an open mind and a compassionate heart, I step into their shoes, if only for a moment, expanding my understanding of the human experience.",
  // "Tears stream down my face, a cleansing release of pent-up emotions. Vulnerability, often seen as weakness, is today my strength. Sharing my pain with a trusted friend, I find solace in their understanding and acceptance. Their gentle words like a balm on my wounds, offering comfort and support. In this act of vulnerability, I connect not only with my friend but also with my own humanity, fostering compassion for myself and others.",
  // "Stars shimmer in the inky night sky, each one a tiny beacon of light. Tonight, I gaze upwards, filled with a sense of awe and wonder. The vastness of the universe reminds me of the insignificance of my worries, yet also ignites a spark of hope within. Even in the darkest moments, light persists, whispering promises of new beginnings. With renewed optimism, I close my eyes, embracing the hope that tomorrow brings.",
];

export const getUsers = () => {
  return users.map(user => {
    return {
      id: Number(user[user.length - 1]),
      username: user,
      email: `${user}@journal-jam.com`,
      password: username,
    }
  })
}

export const getEntries = () => {
  let user = 0;
  let day = 1;
  return journalEntries.map(entry => {
    const date = new Date(2024, 0, day++);
    user = (user + 1) % 3;
    return {
      user,
      content: entry,
      title: date.toLocaleString(),
      createdAt: date,
    }
  });
}