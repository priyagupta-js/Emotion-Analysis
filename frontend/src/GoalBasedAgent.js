export function GoalBasedAgent(emotion) {
    const lowerEmotion = emotion.toLowerCase();
    let customMessage = "";
  
    switch (lowerEmotion) {
      case "happiness":
        customMessage = "Glad to hear you are happy!";
        break;
      case "sadness":
        customMessage = "I am here for you. It's okay to feel sad sometimes.";
        break;
      case "worry":
        customMessage = "Take a deep breath. Things will be okay.";
        break;
      case "neutral":
        customMessage = "Thanks for sharing. Feel free to talk more.";
        break;
      case "love":
        customMessage = "Love is beautiful. Spread it around!";
        break;
      default:
        customMessage = "Thanks for expressing yourself!";
    }
  
    return customMessage;
  }
  