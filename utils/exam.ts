export const calculateEfficiency = (submission: any) => {
    // Total number of attempted questions (correct + wrong)
    const attemptedQuestions = submission.correct + submission.wrong;
    
    // Ratio of attempted questions to total questions
    const questionEfficiency = attemptedQuestions / submission.totalMarks;
  
    // Ratio of total exam duration to the time taken by the student
    const timeEfficiency = submission.totalDuration / submission.duration;
  
    // Overall efficiency as the product of both ratios
    const efficiency = questionEfficiency * timeEfficiency;
  
    // Convert efficiency to percentage
    const efficiencyPercentage = efficiency * 100;
  
    return -1*(100-efficiencyPercentage).toFixed(2); // Returning the value rounded to two decimal places
  }