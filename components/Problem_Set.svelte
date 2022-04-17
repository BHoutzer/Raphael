<script>
  /*
    Problem Selection - allows you to modify the problem's parameters.
    An overarching goal that each problem helps to solve - some set of metrics that all problems are designed to improve on. These metrics need some range that all problems need to be in to consider the problem to be solved. Needs a few sub-goals and a stretch goal.
    Difficulty Curve - Optimized for Cognitive Load. If they can achieve a set of simple goals, they can move onto a set of more difficult goals, and continuing on until they reach the stretch goals. The AI will help you to design these Problems based on your strengths and weaknesses.
      - They get stretch goals if they can consistently achieve the main goal multiple times in a row, implying that they can handle more.
      - Needs a minimum amount of Cognitive Load before they can be done.
      - The number of Attempts they get before failing.
      - Number of correct moves needed before you succeed.
    AI Suggestions - when the user creates their own Problem Set, the AI suggests ways to change problem parameters to optimize the Difficulty Curve.
    Review - When a Part of a Skill has low enough Proficiency and Independence that the user would want to review the material after attempting to succeed at the Problem Set. Offer little practices that are aimed at just showing the user how to correct a specific error.

    Goal -> Select Problems related to that Goal (and their parameters) -> Create Difficulty Curve (includes Review Criteria) -> Problem Set -> Final Results (base this page off of how video games show how you've gained experience points - give them a Dopamine hit to reward them for making progress)

    The best Goal to select is the one that causes the student to both improve on the skills required to master the skills leading up it and move onto problems that they aren't ready for yet.

    The difficulty curve must be designed such that you are gradually compounding skills. Essentially, the Problem Set must work its way along some Branch of the Skill Tree. How many Parts are included depends on how Proficient the user is at those skills. These Branches are designed to maximize Cognitive Load and push users higher up Bloom's Taxonomy.

    You need to design a Skill Tree that allows people to explore all of its branches.
    - Selecting a node should allow you to select options. Like what?
    1. Take Lesson/Review
    2. Create Problem Set

    Selecting a Lesson Node allows you to use it as the main Goal. The next page would then allow you to build the Difficulty Curve.

    All data must be represented in a Graph data structure.

    Sections:
    1. Goal
    2. Problem Selection
    - These Problems and their parameters are related to the Goal.
    3. Create Difficulty Curve
    - Includes Review Criteria
    4. Problem Set
    5. Final Results

  Grading Metrics:
  - Proficiency - A metric that measures how many correct attempts can be consistently done in a row.
  - Independence - A metric that measures how much the user can maintain Proficiency without getting visual feedback.
  - Experience - A metric that measures how many attempts have been made on a Part of a Skill. May even measure the Time spent.
  - Compound Threshold - The minimum threshold each Metric needs to surpass before they can be compounded with another skill.

  GUI (placed on Canvas):
  - Number of attempts left
  - Number of problems solved in a row

  */
</script>
