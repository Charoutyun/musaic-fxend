import React, {useState} from "react";
import 

// Define type for message
interface Message {
    text: string;
    sender: 'user' | 'bot'
}

// Main Chatroom
const Chatroom: React.FC = () => {
    const [messages, setMessages] = useState<Message[]>([]); // hold the messages
    const [inputText, setInputText] = useState<string>(''); // hold input text

    // Function: handle sending message
    const sendMessage = () => {
        if (inputText.trim()) { // send message if not empty
            const userMessage: Message = { text: inputText, sender: 'user' } // create new object
            setMessages((prevMessages) => [...prevMessages, userMessage]); // update message state with user input
            
            setInputText(''); // Clear input field when message is sent

            setTimeout(() => { // Generate bot response
                const botResponse: Message = { text: getBotResponse(inputText), sender: 'bot'};
                setMessages((prevMessages) => [...prevMessages, botResponse]);

            }, 1000); // Simulate delay for response
        }
    };

    // Function: handle input changes
    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setInputText(event.target.value);
    };

    const getBotResponse = (userInput: string): string => {
        if (userInput.toLowerCase().includes('hello')) {
            return 'Hello! What music are you looking for?';
        }
        return "I'm not sure how to respond to that...";
    };

    return {
        <div style={styles.chatContainer}>
    }
}