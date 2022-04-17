<main>
	<Canvas />
</main>

<script>
  //ALL LESSONS MUST BE DESIGNED IN 'Lessons.json'
  "use strict";
  import { onMount } from "svelte";
  import Canvas from "./Canvas.svelte";
  import { list_of_forms } from "./Pointer_Store.js";
  import { palette } from "./Palette.js";

  let lesson = {
    Exercise_Number: {
      Exercise_Name: "",
      Forms: {
        Straight_Line: {},
        Ellipse: {},
        Cube: {},
        Sphere: {},
        Cylinder: {}
      },
      Lesson: {
        Simple_Instruction: "",
        Grading_Rubric: ""
      },
      Perspective: [0, 1],
      Light: [0, 1],
      Texture: [0, 1]
    }
  };

  let form1 = {
    geometry: "cube",
    color: palette.at(1),
    position: { x: 2, y: 2, z: 2 },
    rotation: { x: 45, y: 45, z: 45 },
    scale: { x: 1, y: 1, z: 1 }
  };

  let form2 = {
    geometry: "endpoint",
    color: palette.at(10),
    position: { x: 0, y: 0, z: 0 },
    rotation: { x: 0, y: 0, z: 0 },
    scale: { x: 1, y: 1, z: 1 }
  };

  $list_of_forms = [form1];
</script>

<!--
Example:
Instruction:
- 'Draw a straight line from point A to point B'

Parts:
1. Draw at a fast and consistent speed
-> Measure the speed of a line
2. Start on Point A
3. End on Point B

Grading Rubric:
1. Draw at a fast and consistent speed
- Draw too slow
- Draw too fast
- Draw at an inconsistent speed at a specific section of the line - the start, middle, the end

2. Start on Point A & End on Point B
- Drawing before/after/above/below the Point & the distance

Interaction:
- Canvas, with two Points labelled A and B.

---

Create a grading rubric on the exercise and give feedback on it.
- Import draw_line and draw_ellipse from Form_Manager.py.
  - Create Circles around Line Endpoints.
  - Create a line above and below a line.
  - Get their arguments from a database.
  - These feedback lines need to record the recent history of line accuracy.
    - They need to focus on the accuracy history of a practice.

Each exercise should aim on giving a small, consistent improvement.
- At the end of this series of attempts, the exercise gives you a summary of your attempts.
  1. consistent strengths
  2. consistent weaknesses

Each exercise needs to record where a user has made some mistakes.
Each exercise should focus on fixing some mistake.
You'll need some way to create exercises based on your history of strengths and weaknesses.
This should be listed at the start of the exercise.
The start page of each exercise should list the parts, how well you're doing at those parts, and you should be able to select which parts you include in your current practice.
How would you represent this information?
- The user should be able to select which parts they want to work on at the same time within an exercise.

Exercise Overview:
1. List the Parts.
2. List the user's proficiency at each Part - visualize this.
3. List a red dot next to recommended Parts to work on for the next exercise. Needs a button that will load the recommended parts into an Exercise.
4. A way to select the Parts you want in the next Exercise. A checkmark, maybe.

I suppose a Svelte Exercise page needs to list all of the Parts.
These Parts need to have associated variables that control whether they're included in the next exercise.
You need an 'if-structure' that checks the truth value of these variables and adds them to the exercise if they're True.

Maybe my exercise selection should show all of the parts on-screen, and the parts listed next to it.
Selecting the part adds or subtracts it from the visualized parts.
In other words, if the part is off, it'll be grayed out in the visualization.
You can also change the radius of each part's grading criteria by selecting them in the exercise design page.
The standard radius is determined by the last consistent performance.
It should show you the most previous consistently good and bad performances, as well as all your all time consistent best.

Selecting a part should open extra options in a menu, allowing you to modify the exercise. 

# Skill Tree / SOLO Taxonomy
- Contains the Lessons
  - Competency criteria for trying a lesson
  - Their grade
  - The amount of work needed to improve
- When users fail at a Compound Lesson, they need to be sent to do the Lesson Part that they failed at as an Isolation Exercise.

# Perspective
- Render 2D lines in 3D to show how their lines would look in Perspective.
  - Show it from every angle.

# Curriculum
- Exercise playlists: a series of exercises that can help them to improve on some list of metrics

# Feedback
- I suppose the main thing to fix is the first major error. Then, after giving them feedback on how to fix that error, you could see what errors are left over and have people fix those errors while trying to fix the first major error. Once they're able to improve on the first major error, they should work on the next error that can improve their overall performance. This is what the neural network needs to suggest to the student. To gather this data, they need to have some way to figure out what error to fix, how much of a constraint they need to add to the exercise, and for how many iterations it should be practiced.
  - So I need a way to select an error type, the amount of constraint for that error that needs to be added, and how many times the user needs to practice under this constraint.
  - There should be a way to ease an error's constraint into an exercise to see how it affects the user's cognitive load. Try to optimize their Intrinsic Load.
- There should be a summary page that shows the user's total errors and successes.

# Review
- Uses Spaced Repetition and Retrieval Practice.

# Exercises
- Use 3 act structure
  1. Introduce the idea - the tutorial with the one instruction and one interactive goal. (should this give feedback? Perhaps not. Each instruction should be divided into their own lessons.)
  2. Have people accomplish goals using this mechanic. Each goal should give the user some kind of feedback on how well they did.
  3. Finish with some final challenge.
     - They should get a score of some kind.

# Lesson Design
- A Schema made up of a Hierarchy of Parts
  - Parts need to be their own Svelte Components.
    - Parts should be Svelte page that is populated with Props.
  - Each Part needs the same Properties
    1. Simple instruction (basic english, small sentence)
    2. Simple interactive goal (gives you only one thing to do)
       - An adjustable difficulty curve to keep people in a Flow State.
         - Try to push them beyond that.
    3. Simple feedback (shows you the ways you'll be graded on the goal)
       - The Grading Criteria is made from the same code as the Goal.
         - The Grading Criteria is written as ways to not meet the Goal's conditions.
         - This is what the student must interact with.
         - As they consistently improve, the student must receive less and less feedback to see if they have internalized giving that feedback on their own.
           - If they've internalized that feedback, then errors will be shown in Review.
           - If they make too may errors in a row, they need to revisit that lesson.
       - Once the Feedback is internalized, the Lesson's single feedback gets compounded with other lessons.
    4. A set of ThreeJS Forms.
- Solo's Taxonomy
- Optimized Cognitive Load
- Each practice allows you to add Perspective, Texture, and Lighting.

# Grading Criteria

# Expertise
- Partially measured by how much a user needs feedback and reviews to correct a mistake. See if they can correct it on their own.

# Markmaking:
- Draw lines within a window with consistent proportions. Then, to normalize the data, you can compare all angles to those proportions.
-->
