export const calculateEfficiency = (correct: number, wrong: number, totalMarks: number, totalDuration: number, duration: number) => {
    // Total number of attempted questions (correct + wrong)
    const attemptedQuestions = correct + wrong;
    
    // Ratio of attempted questions to total questions
    const questionEfficiency = attemptedQuestions / totalMarks;
  
    // Ratio of total exam duration to the time taken by the student
    const timeEfficiency = totalDuration / duration;
  
    // Overall efficiency as the product of both ratios
    const efficiency = questionEfficiency * timeEfficiency;
  
    // Convert efficiency to percentage
    const efficiencyPercentage = efficiency * 100;
  
    return -1*(100-efficiencyPercentage); // Returning the value rounded to two decimal places
  }