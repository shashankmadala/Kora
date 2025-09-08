import { collection, getDocs, orderBy, query, addDoc, Timestamp } from 'firebase/firestore'
import { db } from '../firebase/firebase'

const samplePosts = [
    {
        title: "My 5-year-old son's progress with ABA therapy",
        content: "Hi everyone! I wanted to share some positive news about my son Arjun. We started ABA therapy 6 months ago and I'm amazed at the progress he's made. His communication has improved so much - he's now using 2-3 word phrases consistently! The therapist has been wonderful and really understands his needs. For other parents considering ABA, I'd say give it time and be patient. The first few weeks were challenging but now I can see the benefits. Has anyone else had similar experiences?",
        tags: ["ABA Therapy", "Progress", "Communication", "Success Story"],
        username: "Priya Sharma",
        comments: [
            {
                username: "Rajesh Patel",
                content: "That's wonderful news, Priya! My daughter Meera also started ABA recently. How many hours per week does Arjun attend?",
                id: "comment1",
                creationDate: Timestamp.fromDate(new Date(Date.now() - 2 * 24 * 60 * 60 * 1000))
            },
            {
                username: "Sunita Kumar",
                content: "Congratulations! It's so heartwarming to hear success stories. My son is 4 and we're considering ABA. Any tips for getting started?",
                id: "comment2",
                creationDate: Timestamp.fromDate(new Date(Date.now() - 1 * 24 * 60 * 60 * 1000))
            },
            {
                username: "Priya Sharma",
                content: "Thank you both! Arjun goes 20 hours per week. My tip would be to find a center that really aligns with your family values and be consistent with the schedule.",
                id: "comment3",
                creationDate: Timestamp.fromDate(new Date(Date.now() - 12 * 60 * 60 * 1000))
            }
        ],
        creationDate: Timestamp.fromDate(new Date(Date.now() - 5 * 24 * 60 * 60 * 1000))
    },
    {
        title: "Sensory-friendly birthday party ideas?",
        content: "My daughter Kavya is turning 6 next month and I want to plan a birthday party that's comfortable for her. She has sensory sensitivities to loud noises and bright lights. I'm thinking of having it at home with soft lighting and quiet activities. Any suggestions for sensory-friendly party games or activities? Also, should I mention her autism to other parents when sending invitations? I want to be inclusive but also want everyone to have a good time.",
        tags: ["Sensory Issues", "Birthday Party", "Family Support", "Inclusion"],
        username: "Anita Reddy",
        comments: [
            {
                username: "Vikram Singh",
                content: "Great question! We had a sensory-friendly party for our son last year. We used fairy lights instead of bright overhead lights and had a quiet corner with books and soft toys. The kids loved it!",
                id: "comment4",
                creationDate: Timestamp.fromDate(new Date(Date.now() - 3 * 24 * 60 * 60 * 1000))
            },
            {
                username: "Deepa Iyer",
                content: "For games, we did sensory bins with rice and beans, coloring activities, and a 'quiet dance' where kids moved slowly to soft music. As for invitations, I usually mention it briefly - something like 'We're having a calm, sensory-friendly celebration.'",
                id: "comment5",
                creationDate: Timestamp.fromDate(new Date(Date.now() - 2 * 24 * 60 * 60 * 1000))
            }
        ],
        creationDate: Timestamp.fromDate(new Date(Date.now() - 4 * 24 * 60 * 60 * 1000))
    },
    {
        title: "School is refusing to provide speech therapy - what are my rights?",
        content: "I'm frustrated and need advice. My 7-year-old son Rohan has an IEP that includes speech therapy, but the school keeps saying they don't have enough speech therapists and are trying to reduce his services. They want to cut his sessions from 3 times per week to once per week. I know this isn't right, but I'm not sure how to advocate for him. Can anyone share their experience with similar situations? What should I do?",
        tags: ["School Support", "IEP", "Speech Therapy", "Advocacy", "Legal Rights"],
        username: "Manoj Gupta",
        comments: [
            {
                username: "Sushma Joshi",
                content: "This is unfortunately common. Document everything in writing and request an IEP meeting immediately. You have the right to bring an advocate or attorney. Don't let them reduce services without proper justification.",
                id: "comment6",
                creationDate: Timestamp.fromDate(new Date(Date.now() - 1 * 24 * 60 * 60 * 1000))
            },
            {
                username: "Amit Desai",
                content: "I went through this with my daughter. I requested a due process hearing and they backed down immediately. Sometimes schools try to see what they can get away with. Stand your ground!",
                id: "comment7",
                creationDate: Timestamp.fromDate(new Date(Date.now() - 6 * 60 * 60 * 1000))
            },
            {
                username: "Manoj Gupta",
                content: "Thank you both. I'm going to request an IEP meeting and document everything. It's reassuring to know others have faced this and won.",
                id: "comment8",
                creationDate: Timestamp.fromDate(new Date(Date.now() - 2 * 60 * 60 * 1000))
            }
        ],
        creationDate: Timestamp.fromDate(new Date(Date.now() - 3 * 24 * 60 * 60 * 1000))
    },
    {
        title: "Sleep issues - my 4-year-old won't sleep through the night",
        content: "I'm exhausted and need help. My daughter Ishita has always had trouble sleeping, but it's gotten worse lately. She wakes up 3-4 times per night and takes hours to fall back asleep. We've tried weighted blankets, white noise, and melatonin (with doctor's approval), but nothing seems to work consistently. Her sleep schedule is affecting the whole family. Has anyone found effective solutions for sleep problems? I'm desperate for some rest!",
        tags: ["Sleep Issues", "Family Support", "Behavioral Strategies", "Health"],
        username: "Rekha Nair",
        comments: [
            {
                username: "Kiran Mehta",
                content: "I feel your pain! My son had similar issues. We found that a strict bedtime routine and blackout curtains helped a lot. Also, limiting screen time 2 hours before bed made a big difference.",
                id: "comment9",
                creationDate: Timestamp.fromDate(new Date(Date.now() - 2 * 24 * 60 * 60 * 1000))
            },
            {
                username: "Pooja Agarwal",
                content: "Have you tried a sleep study? Sometimes there are underlying medical issues. Also, we use a visual schedule for bedtime that really helps our daughter understand the routine.",
                id: "comment10",
                creationDate: Timestamp.fromDate(new Date(Date.now() - 1 * 24 * 60 * 60 * 1000))
            }
        ],
        creationDate: Timestamp.fromDate(new Date(Date.now() - 2 * 24 * 60 * 60 * 1000))
    },
    {
        title: "First day of kindergarten - any tips for a smooth transition?",
        content: "My son Aditya is starting kindergarten next week and I'm nervous about the transition. He's been in a small preschool setting and kindergarten will be much bigger with more kids and noise. We've been practicing the new routine and visited the school twice, but I'm still worried about how he'll handle the change. Any tips from parents who've been through this transition? What should I prepare for?",
        tags: ["School Support", "Transition", "Routine", "Early Intervention"],
        username: "Neha Kapoor",
        comments: [
            {
                username: "Ravi Sharma",
                content: "We went through this last year with our daughter. The key is preparation and communication with the teacher. Make sure they understand your child's needs and have a plan for difficult moments.",
                id: "comment11",
                creationDate: Timestamp.fromDate(new Date(Date.now() - 1 * 24 * 60 * 60 * 1000))
            },
            {
                username: "Shilpa Reddy",
                content: "Create a social story about kindergarten! We made one with pictures of the school, teacher, and activities. It really helped our son feel more prepared and less anxious.",
                id: "comment12",
                creationDate: Timestamp.fromDate(new Date(Date.now() - 12 * 60 * 60 * 1000))
            }
        ],
        creationDate: Timestamp.fromDate(new Date(Date.now() - 1 * 24 * 60 * 60 * 1000))
    },
    {
        title: "Medicaid coverage for ABA therapy - anyone have experience?",
        content: "I'm trying to get ABA therapy covered through Medicaid for my 3-year-old daughter. The process seems complicated and I'm getting conflicting information. Some people say it's covered, others say it's not. Has anyone successfully gotten Medicaid to cover ABA? What was the process like? I'm in New Jersey if that makes a difference. Any advice would be greatly appreciated!",
        tags: ["Financial", "ABA Therapy", "Medicaid", "Insurance"],
        username: "Jaya Patel",
        comments: [
            {
                username: "Arun Kumar",
                content: "Yes, Medicaid does cover ABA in NJ! The key is getting a proper diagnosis and prescription from a developmental pediatrician. We had to appeal the first denial but eventually got approved.",
                id: "comment13",
                creationDate: Timestamp.fromDate(new Date(Date.now() - 1 * 24 * 60 * 60 * 1000))
            },
            {
                username: "Meera Singh",
                content: "It took us 6 months but we got it covered. Make sure you have all the documentation and don't give up if they deny it initially. Many families have to appeal.",
                id: "comment14",
                creationDate: Timestamp.fromDate(new Date(Date.now() - 8 * 60 * 60 * 1000))
            }
        ],
        creationDate: Timestamp.fromDate(new Date(Date.now() - 6 * 60 * 60 * 1000))
    },
    {
        title: "My child is non-verbal but so smart - communication strategies?",
        content: "My 6-year-old son Varun is non-verbal but incredibly intelligent. He understands everything we say and can solve puzzles that amaze me. We're using PECS (Picture Exchange Communication System) and he's making progress, but I want to explore other options. Has anyone had success with AAC devices or other communication methods? I want to give him every opportunity to express himself. Any recommendations for devices or apps?",
        tags: ["Communication", "AAC Device", "Non-verbal", "Technology"],
        username: "Lakshmi Iyer",
        comments: [
            {
                username: "Suresh Nair",
                content: "Our daughter uses Proloquo2Go on an iPad and it's been life-changing! She went from 0 words to expressing complex thoughts. The key is finding the right vocabulary set and being consistent with use.",
                id: "comment15",
                creationDate: Timestamp.fromDate(new Date(Date.now() - 1 * 24 * 60 * 60 * 1000))
            },
            {
                username: "Geeta Sharma",
                content: "We tried several AAC apps before finding TouchChat. It's more expensive but worth it. Also, don't underestimate sign language - even basic signs can help reduce frustration.",
                id: "comment16",
                creationDate: Timestamp.fromDate(new Date(Date.now() - 4 * 60 * 60 * 1000))
            }
        ],
        creationDate: Timestamp.fromDate(new Date(Date.now() - 3 * 60 * 60 * 1000))
    },
    {
        title: "Sibling support - how to help my neurotypical daughter understand her brother",
        content: "My 8-year-old daughter Maya is neurotypical and sometimes struggles to understand why her 5-year-old brother Aryan behaves differently. She gets frustrated when he has meltdowns or doesn't want to play the same games. I want to help her understand autism better and strengthen their relationship. Any suggestions for age-appropriate explanations or activities they can do together? I want both my children to feel loved and supported.",
        tags: ["Family Support", "Siblings", "Understanding", "Relationships"],
        username: "Divya Agarwal",
        comments: [
            {
                username: "Rohit Mehta",
                content: "We have a similar situation. We found that explaining autism in terms of 'different brains' helped our daughter understand. We also make sure she gets one-on-one time with us regularly.",
                id: "comment17",
                creationDate: Timestamp.fromDate(new Date(Date.now() - 1 * 24 * 60 * 60 * 1000))
            },
            {
                username: "Nisha Kapoor",
                content: "There are great children's books about autism and siblings. 'My Brother Charlie' and 'All My Stripes' are wonderful. Also, consider sibling support groups - they can be really helpful.",
                id: "comment18",
                creationDate: Timestamp.fromDate(new Date(Date.now() - 6 * 60 * 60 * 1000))
            },
            {
                username: "Divya Agarwal",
                content: "Thank you for the book recommendations! I'll definitely look into those and see if there are any sibling groups in our area.",
                id: "comment19",
                creationDate: Timestamp.fromDate(new Date(Date.now() - 2 * 60 * 60 * 1000))
            }
        ],
        creationDate: Timestamp.fromDate(new Date(Date.now() - 1 * 60 * 60 * 1000))
    }
]

export const getPosts = async () => {
    try {
        const posts: Post[] = []
        const snapshot = await getDocs(query(collection(db, 'posts'), orderBy('creationDate', 'desc')))
        snapshot.forEach(doc => {
            posts.push({ id: doc.id, ...doc.data() } as Post)
        })
        
        // If no posts exist, return sample posts (don't add to Firebase to avoid issues)
        if (posts.length === 0) {
            console.log('No posts found, returning sample posts...')
            return samplePosts.map((post, index) => ({ id: `sample-${index}`, ...post })) as Post[]
        }
        
        return posts
    } catch (error) {
        console.error('Error fetching posts:', error)
        // Return sample posts as fallback
        return samplePosts.map((post, index) => ({ id: `sample-${index}`, ...post })) as Post[]
    }
}