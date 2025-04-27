import { db } from './db';
import { categories, contentEntries } from '@shared/schema';
import { storage } from './storage';
import { hashPassword } from './auth';

// Seed categories and content
export async function seedDatabase() {
  try {
    // Check if we already have categories
    const existingCategories = await storage.getCategories();
    
    if (existingCategories.length === 0) {
      console.log('Seeding categories...');
      
      // Create categories
      const personalGrowth = await storage.createCategory({
        name: 'Personal Growth',
        description: 'Reflections on my journey of self-improvement and growth',
        type: 'personal_growth'
      });
      
      const creativity = await storage.createCategory({
        name: 'Creative Process',
        description: 'Thoughts on creativity, inspiration, and artistic expression',
        type: 'creative'
      });
      
      const relationships = await storage.createCategory({
        name: 'Relationships & Connection',
        description: 'Exploring human connection, love, and relationships',
        type: 'relationship_reflections'
      });
      
      const philosophy = await storage.createCategory({
        name: 'Philosophy & Worldview',
        description: 'My personal philosophy and perspective on life',
        type: 'philosophy'
      });
      
      const professional = await storage.createCategory({
        name: 'Professional Journey',
        description: 'Career reflections and professional growth',
        type: 'professional_journey'
      });
      
      // Add some content entries
      console.log('Seeding content entries...');
      
      // Personal Growth entries
      await storage.createContentEntry({
        title: 'On Embracing Vulnerability',
        content: `One of the most profound lessons I've learned is that true strength lies in vulnerability. For years, I believed that keeping my emotions contained was the way to project confidence and control. But I've come to understand that genuine connection with others—and with myself—requires opening up those carefully guarded parts of my heart.

When I allow myself to be seen, truly seen, with all my imperfections and uncertainties, that's when real growth happens. It's terrifying, yes. There's always that fear of judgment or rejection. But without that risk, we stay in shallow waters, never experiencing the depth of what it means to be human.

Vulnerability isn't weakness—it's the courage to show up authentically even when there are no guarantees. It's the birthplace of creativity, innovation, and change. I'm still learning this lesson every day, still finding the balance between protection and openness. But each time I choose to share a piece of myself that feels fragile, I find not the judgment I feared, but connection. And that makes all the difference.`,
        categoryId: personalGrowth.id,
        status: 'published'
      });
      
      // Creativity entry
      await storage.createContentEntry({
        title: 'The Space Between Inspiration and Creation',
        content: `There's a sacred space between the moment inspiration strikes and the completion of something created. I've come to cherish this liminal space—sometimes peaceful, sometimes chaotic, but always alive with possibility.

Creativity isn't a straight line from idea to execution. It's a winding path with moments of clarity interspersed with periods of doubt. Some days, the words or images flow effortlessly, as if they were waiting just beneath the surface for permission to emerge. Other days, creating feels like excavation, carefully digging through layers of mental noise to find something honest.

What I've learned to appreciate is the tension itself. The push and pull between what I envision and what manifests. The struggle isn't separate from the creative process—it is the process. And there's a certain beauty in surrendering to that dance, in acknowledging that the final creation may be different from what I initially imagined, and that's not only okay, it's often where the magic happens.

The space between inspiration and creation is where we grow, where we learn to trust both the vision and the journey. It's where we develop the patience to let ideas ripen and the courage to share them before they feel perfect.`,
        categoryId: creativity.id,
        status: 'published'
      });
      
      // Relationships entry
      await storage.createContentEntry({
        title: 'The Art of Listening',
        content: `I believe that listening—truly listening—might be one of the greatest gifts we can offer another person. In a world where everyone is fighting to be heard, the simple act of giving someone your full attention has become rare and precious.

When I reflect on the moments of deepest connection in my life, they've almost always centered around feeling completely heard and understood. Not judged, not advised, just heard. And I've noticed that when I manage to quiet my own internal dialogue, to push aside the temptation to formulate my response while someone else is speaking, something remarkable happens. The conversation deepens. The other person opens up. We move from surface-level exchange to something meaningful.

Listening requires patience. It means being comfortable with silence. It means asking questions that come from genuine curiosity rather than a need to fill space or redirect conversation. I'm still learning to master this art—still catching myself when my mind wanders or when I'm waiting for my turn to speak rather than truly absorbing another's words.

The art of listening is about presence. About communicating through your attention that this person, this moment, matters. In doing so, we create space for authentic connection in a world that desperately needs more of it.`,
        categoryId: relationships.id,
        status: 'published'
      });
      
      // Philosophy entry
      await storage.createContentEntry({
        title: 'Finding Meaning in Uncertainty',
        content: `I've always been fascinated by the human search for meaning. How do we make sense of our existence in a universe that offers no clear roadmap? How do we find purpose when so much lies beyond our control?

My own journey with these questions has led me to an unexpected conclusion: perhaps meaning isn't something we discover, but something we create. We aren't passive recipients of purpose, but active participants in crafting it. And this creative act happens most profoundly when we face uncertainty and challenge.

Life's uncertainties—those moments when our carefully constructed plans unravel—initially appear as obstacles. But I've found they're often invitations to deeper meaning. When things fall apart, we're forced to question our assumptions, to reevaluate what truly matters. In that raw, uncomfortable space, we have the opportunity to consciously choose our response, to align our actions with our values in a way that routine rarely demands.

Finding meaning in uncertainty isn't about having answers. It's about embracing the questions. It's about approaching the unknown with curiosity rather than fear. It's about recognizing that our vulnerability in the face of life's unpredictability connects us to every other human being navigating their own path through the same beautiful, terrifying wilderness.`,
        categoryId: philosophy.id,
        status: 'published'
      });
      
      console.log('Database seeded successfully!');
    } else {
      console.log('Database already contains data, skipping seed.');
    }
  } catch (error) {
    console.error('Error seeding database:', error);
  }
}