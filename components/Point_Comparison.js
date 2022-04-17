export const get_speed_between_points = (point_1, point_2) => {
  const distance = get_distance_between_points(point_1, point_2);
  const time_interval = point_2.ms - point_1.ms;

  const speed = distance / time_interval;

  return speed;
};

export const get_distance_between_points = (point_1, point_2) => {
  const distance = Math.sqrt(
    Math.pow(point_2.x - point_1.x, 2) + Math.pow(point_2.y - point_1.y, 2)
  );

  return distance;
};

export const get_angle_between_points = (point_1, point_2) => {
  let y = point_2.y - point_1.y;
  let x = point_2.x - point_1.x;
  const angle = (Math.atan2(y, x) * 180) / Math.PI;

  return angle;
};

/**
Now that you have this stroke data, you need to compare the angles and speeds to one another.
- Indicate when a line's Trajectory has changed by drawing a perpindicular line wherever an angle has drastically changed from the previous angle.

The goal is to find the speed that will reduce the number of segments.
These segments are defined as small angle errors between nearby points.
This needs to be a variable.

I need a way to figure out which methods will eventually lead to a reduction in errors.
-> This will lead to a curriculum that is designed to reduce errors over time.

Speed needs to be consistent for the whole stroke.

The Speed feedback needs to indicate what speed is consistent and prevents you from having small accuracy errors.
-> What kind of data visualization would accomplish this?
  -> I think the best thing to do would be to show the speed using a circle that moves over the line to show how fast someone has drawn the line.

The point of the Speed Exercise is to create a Speed Standard that can be used to give people feedback for their drawing. If the user moves onto a different practice, 

Users must practice their Speed until they can consistently draw at some speed that reduces small accuracy errors.

I also need to measure the angles between two points.
When the angles between two points is too large, they're separated into its own segment.
The goal here is to have as few segments as possible.
Keep track of where these segments tend to happen.
*/
