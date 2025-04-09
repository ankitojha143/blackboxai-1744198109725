const lessons = [
    {
        id: 1,
        title: "Greetings",
        description: "Practice common English greetings",
        icon: "fa-handshake",
        exercises: [
            {
                type: "phrase",
                text: "Hello, how are you?",
                response: "I'm fine, thank you."
            },
            {
                type: "phrase", 
                text: "Good morning!",
                response: "Good morning!"
            },
            {
                type: "phrase",
                text: "What's your name?",
                response: "My name is [your name]"
            }
        ]
    },
    {
        id: 2,
        title: "Introductions",
        description: "Introduce yourself in English",
        icon: "fa-user",
        exercises: [
            {
                type: "phrase",
                text: "Where are you from?",
                response: "I'm from [your country]"
            },
            {
                type: "phrase",
                text: "What do you do?",
                response: "I'm a [your job]"
            }
        ]
    },
    {
        id: 3,
        title: "Restaurant",
        description: "Order food in a restaurant",
        icon: "fa-utensils",
        exercises: [
            {
                type: "phrase",
                text: "I would like to order...",
                response: "I would like [food item]"
            },
            {
                type: "phrase",
                text: "Could I have the menu please?",
                response: "Could I have the menu please?"
            }
        ]
    }
];

// For future lesson expansion
function getLessonById(id) {
    return lessons.find(lesson => lesson.id === id);
}

function getAllLessons() {
    return lessons;
}
