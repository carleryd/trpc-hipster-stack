/* eslint-disable */
/* tslint:disable */
// @ts-nocheck
/*
 * ---------------------------------------------------------------
 * ## THIS FILE WAS GENERATED VIA SWAGGER-TYPESCRIPT-API        ##
 * ##                                                           ##
 * ## AUTHOR: acacode                                           ##
 * ## SOURCE: https://github.com/acacode/swagger-typescript-api ##
 * ---------------------------------------------------------------
 */

export interface Error {
  /** The code associated with this error. */
  code?: string;
  /** The specific field or aspect of the resource associated with this error. */
  field?: string;
  /** The type of resource associated with this error. */
  resource?: string;
}

/** Encapsulates the errors that may be returned from the API. */
export interface Fault {
  /** The set of specific errors associated with this fault, if any. */
  errors?: Error[];
  /** The message of the fault. */
  message?: string;
}

/** A roll-up of metrics pertaining to a set of activities. Values are in seconds and meters. */
export interface ActivityTotal {
  /** The number of activities considered in this total. */
  count?: number;
  /**
   * The total distance covered by the considered activities.
   * @format float
   */
  distance?: number;
  /** The total moving time of the considered activities. */
  moving_time?: number;
  /** The total elapsed time of the considered activities. */
  elapsed_time?: number;
  /**
   * The total elevation gain of the considered activities.
   * @format float
   */
  elevation_gain?: number;
  /** The total number of achievements of the considered activities. */
  achievement_count?: number;
}

/** A set of rolled-up statistics and totals for an athlete */
export interface ActivityStats {
  /**
   * The longest distance ridden by the athlete.
   * @format double
   */
  biggest_ride_distance?: number;
  /**
   * The highest climb ridden by the athlete.
   * @format double
   */
  biggest_climb_elevation_gain?: number;
  /** The recent (last 4 weeks) ride stats for the athlete. */
  recent_ride_totals?: ActivityTotal;
  /** The recent (last 4 weeks) run stats for the athlete. */
  recent_run_totals?: ActivityTotal;
  /** The recent (last 4 weeks) swim stats for the athlete. */
  recent_swim_totals?: ActivityTotal;
  /** The year to date ride stats for the athlete. */
  ytd_ride_totals?: ActivityTotal;
  /** The year to date run stats for the athlete. */
  ytd_run_totals?: ActivityTotal;
  /** The year to date swim stats for the athlete. */
  ytd_swim_totals?: ActivityTotal;
  /** The all time ride stats for the athlete. */
  all_ride_totals?: ActivityTotal;
  /** The all time run stats for the athlete. */
  all_run_totals?: ActivityTotal;
  /** The all time swim stats for the athlete. */
  all_swim_totals?: ActivityTotal;
}

export interface MetaAthlete {
  /**
   * The unique identifier of the athlete
   * @format int64
   */
  id?: number;
}

export type SummaryAthlete = MetaAthlete & {
  /** Resource state, indicates level of detail. Possible values: 1 -> "meta", 2 -> "summary", 3 -> "detail" */
  resource_state?: number;
  /** The athlete's first name. */
  firstname?: string;
  /** The athlete's last name. */
  lastname?: string;
  /** URL to a 62x62 pixel profile picture. */
  profile_medium?: string;
  /** URL to a 124x124 pixel profile picture. */
  profile?: string;
  /** The athlete's city. */
  city?: string;
  /** The athlete's state or geographical region. */
  state?: string;
  /** The athlete's country. */
  country?: string;
  /** The athlete's sex. */
  sex?: "M" | "F";
  /** Deprecated.  Use summit field instead. Whether the athlete has any Summit subscription. */
  premium?: boolean;
  /** Whether the athlete has any Summit subscription. */
  summit?: boolean;
  /**
   * The time at which the athlete was created.
   * @format date-time
   */
  created_at?: string;
  /**
   * The time at which the athlete was last updated.
   * @format date-time
   */
  updated_at?: string;
};

export interface MetaClub {
  /**
   * The club's unique identifier.
   * @format int64
   */
  id?: number;
  /** Resource state, indicates level of detail. Possible values: 1 -> "meta", 2 -> "summary", 3 -> "detail" */
  resource_state?: number;
  /** The club's name. */
  name?: string;
}

/** An enumeration of the types an activity may have. Note that this enumeration does not include new sport types (e.g. MountainBikeRide, EMountainBikeRide), activities with these sport types will have the corresponding activity type (e.g. Ride for MountainBikeRide, EBikeRide for EMountainBikeRide) */
export enum ActivityType {
  AlpineSki = "AlpineSki",
  BackcountrySki = "BackcountrySki",
  Canoeing = "Canoeing",
  Crossfit = "Crossfit",
  EBikeRide = "EBikeRide",
  Elliptical = "Elliptical",
  Golf = "Golf",
  Handcycle = "Handcycle",
  Hike = "Hike",
  IceSkate = "IceSkate",
  InlineSkate = "InlineSkate",
  Kayaking = "Kayaking",
  Kitesurf = "Kitesurf",
  NordicSki = "NordicSki",
  Ride = "Ride",
  RockClimbing = "RockClimbing",
  RollerSki = "RollerSki",
  Rowing = "Rowing",
  Run = "Run",
  Sail = "Sail",
  Skateboard = "Skateboard",
  Snowboard = "Snowboard",
  Snowshoe = "Snowshoe",
  Soccer = "Soccer",
  StairStepper = "StairStepper",
  StandUpPaddling = "StandUpPaddling",
  Surfing = "Surfing",
  Swim = "Swim",
  Velomobile = "Velomobile",
  VirtualRide = "VirtualRide",
  VirtualRun = "VirtualRun",
  Walk = "Walk",
  WeightTraining = "WeightTraining",
  Wheelchair = "Wheelchair",
  Windsurf = "Windsurf",
  Workout = "Workout",
  Yoga = "Yoga",
}

export type SummaryClub = MetaClub & {
  /** URL to a 60x60 pixel profile picture. */
  profile_medium?: string;
  /** URL to a ~1185x580 pixel cover photo. */
  cover_photo?: string;
  /** URL to a ~360x176  pixel cover photo. */
  cover_photo_small?: string;
  /** Deprecated. Prefer to use activity_types. */
  sport_type?: "cycling" | "running" | "triathlon" | "other";
  /** The activity types that count for a club. This takes precedence over sport_type. */
  activity_types?: ActivityType[];
  /** The club's city. */
  city?: string;
  /** The club's state or geographical region. */
  state?: string;
  /** The club's country. */
  country?: string;
  /** Whether the club is private. */
  private?: boolean;
  /** The club's member count. */
  member_count?: number;
  /** Whether the club is featured or not. */
  featured?: boolean;
  /** Whether the club is verified or not. */
  verified?: boolean;
  /** The club's vanity URL. */
  url?: string;
};

export interface SummaryGear {
  /** The gear's unique identifier. */
  id?: string;
  /** Resource state, indicates level of detail. Possible values: 2 -> "summary", 3 -> "detail" */
  resource_state?: number;
  /** Whether this gear's is the owner's default one. */
  primary?: boolean;
  /** The gear's name. */
  name?: string;
  /**
   * The distance logged with this gear.
   * @format float
   */
  distance?: number;
}

export type DetailedAthlete = SummaryAthlete & {
  /** The athlete's follower count. */
  follower_count?: number;
  /** The athlete's friend count. */
  friend_count?: number;
  /** The athlete's preferred unit system. */
  measurement_preference?: "feet" | "meters";
  /** The athlete's FTP (Functional Threshold Power). */
  ftp?: number;
  /**
   * The athlete's weight.
   * @format float
   */
  weight?: number;
  /** The athlete's clubs. */
  clubs?: SummaryClub[];
  /** The athlete's bikes. */
  bikes?: SummaryGear[];
  /** The athlete's shoes. */
  shoes?: SummaryGear[];
};

export interface ZoneRange {
  /** The minimum value in the range. */
  min?: number;
  /** The maximum value in the range. */
  max?: number;
}

export type ZoneRanges = ZoneRange[];

export interface HeartRateZoneRanges {
  /** Whether the athlete has set their own custom heart rate zones */
  custom_zones?: boolean;
  zones?: ZoneRanges;
}

export interface PowerZoneRanges {
  zones?: ZoneRanges;
}

export interface Zones {
  heart_rate?: HeartRateZoneRanges;
  power?: PowerZoneRanges;
}

/**
 * A pair of latitude/longitude coordinates, represented as an array of 2 floating point numbers.
 * @maxItems 2
 * @minItems 2
 */
export type LatLng = number[];

export interface SummaryPRSegmentEffort {
  /**
   * The unique identifier of the activity related to the PR effort.
   * @format int64
   */
  pr_activity_id?: number;
  /** The elapsed time ot the PR effort. */
  pr_elapsed_time?: number;
  /**
   * The time at which the PR effort was started.
   * @format date-time
   */
  pr_date?: string;
  /** Number of efforts by the authenticated athlete on this segment. */
  effort_count?: number;
}

export interface SummarySegmentEffort {
  /**
   * The unique identifier of this effort
   * @format int64
   */
  id?: number;
  /**
   * The unique identifier of the activity related to this effort
   * @format int64
   */
  activity_id?: number;
  /** The effort's elapsed time */
  elapsed_time?: number;
  /**
   * The time at which the effort was started.
   * @format date-time
   */
  start_date?: string;
  /**
   * The time at which the effort was started in the local timezone.
   * @format date-time
   */
  start_date_local?: string;
  /**
   * The effort's distance in meters
   * @format float
   */
  distance?: number;
  /** Whether this effort is the current best on the leaderboard */
  is_kom?: boolean;
}

export interface SummarySegment {
  /**
   * The unique identifier of this segment
   * @format int64
   */
  id?: number;
  /** The name of this segment */
  name?: string;
  activity_type?: "Ride" | "Run";
  /**
   * The segment's distance, in meters
   * @format float
   */
  distance?: number;
  /**
   * The segment's average grade, in percents
   * @format float
   */
  average_grade?: number;
  /**
   * The segments's maximum grade, in percents
   * @format float
   */
  maximum_grade?: number;
  /**
   * The segments's highest elevation, in meters
   * @format float
   */
  elevation_high?: number;
  /**
   * The segments's lowest elevation, in meters
   * @format float
   */
  elevation_low?: number;
  /** A pair of latitude/longitude coordinates, represented as an array of 2 floating point numbers. */
  start_latlng?: LatLng;
  /** A pair of latitude/longitude coordinates, represented as an array of 2 floating point numbers. */
  end_latlng?: LatLng;
  /** The category of the climb [0, 5]. Higher is harder ie. 5 is Hors catégorie, 0 is uncategorized in climb_category. */
  climb_category?: number;
  /** The segments's city. */
  city?: string;
  /** The segments's state or geographical region. */
  state?: string;
  /** The segment's country. */
  country?: string;
  /** Whether this segment is private. */
  private?: boolean;
  athlete_pr_effort?: SummaryPRSegmentEffort;
  athlete_segment_stats?: SummarySegmentEffort;
}

export interface PolylineMap {
  /** The identifier of the map */
  id?: string;
  /** The polyline of the map, only returned on detailed representation of an object */
  polyline?: string;
  /** The summary polyline of the map */
  summary_polyline?: string;
}

export type DetailedSegment = SummarySegment & {
  /**
   * The time at which the segment was created.
   * @format date-time
   */
  created_at?: string;
  /**
   * The time at which the segment was last updated.
   * @format date-time
   */
  updated_at?: string;
  /**
   * The segment's total elevation gain.
   * @format float
   */
  total_elevation_gain?: number;
  map?: PolylineMap;
  /** The total number of efforts for this segment */
  effort_count?: number;
  /** The number of unique athletes who have an effort for this segment */
  athlete_count?: number;
  /** Whether this segment is considered hazardous */
  hazardous?: boolean;
  /** The number of stars for this segment */
  star_count?: number;
};

export interface MetaActivity {
  /**
   * The unique identifier of the activity
   * @format int64
   */
  id?: number;
}

export type DetailedSegmentEffort = SummarySegmentEffort & {
  /** The name of the segment on which this effort was performed */
  name?: string;
  activity?: MetaActivity;
  athlete?: MetaAthlete;
  /** The effort's moving time */
  moving_time?: number;
  /** The start index of this effort in its activity's stream */
  start_index?: number;
  /** The end index of this effort in its activity's stream */
  end_index?: number;
  /**
   * The effort's average cadence
   * @format float
   */
  average_cadence?: number;
  /**
   * The average wattage of this effort
   * @format float
   */
  average_watts?: number;
  /** For riding efforts, whether the wattage was reported by a dedicated recording device */
  device_watts?: boolean;
  /**
   * The heart heart rate of the athlete during this effort
   * @format float
   */
  average_heartrate?: number;
  /**
   * The maximum heart rate of the athlete during this effort
   * @format float
   */
  max_heartrate?: number;
  segment?: SummarySegment;
  /**
   * The rank of the effort on the global leaderboard if it belongs in the top 10 at the time of upload
   * @min 1
   * @max 10
   */
  kom_rank?: number;
  /**
   * The rank of the effort on the athlete's leaderboard if it belongs in the top 3 at the time of upload
   * @min 1
   * @max 3
   */
  pr_rank?: number;
  /** Whether this effort should be hidden when viewed within an activity */
  hidden?: boolean;
};

export interface ExplorerSegment {
  /**
   * The unique identifier of this segment
   * @format int64
   */
  id?: number;
  /** The name of this segment */
  name?: string;
  /**
   * The category of the climb [0, 5]. Higher is harder ie. 5 is Hors catégorie, 0 is uncategorized in climb_category. If climb_category = 5, climb_category_desc = HC. If climb_category = 2, climb_category_desc = 3.
   * @min 0
   * @max 5
   */
  climb_category?: number;
  /** The description for the category of the climb */
  climb_category_desc?: "NC" | "4" | "3" | "2" | "1" | "HC";
  /**
   * The segment's average grade, in percents
   * @format float
   */
  avg_grade?: number;
  /** A pair of latitude/longitude coordinates, represented as an array of 2 floating point numbers. */
  start_latlng?: LatLng;
  /** A pair of latitude/longitude coordinates, represented as an array of 2 floating point numbers. */
  end_latlng?: LatLng;
  /**
   * The segments's evelation difference, in meters
   * @format float
   */
  elev_difference?: number;
  /**
   * The segment's distance, in meters
   * @format float
   */
  distance?: number;
  /** The polyline of the segment */
  points?: string;
}

export interface ExplorerResponse {
  /** The set of segments matching an explorer request */
  segments?: ExplorerSegment[];
}

/** An enumeration of the sport types an activity may have. Distinct from ActivityType in that it has new types (e.g. MountainBikeRide) */
export enum SportType {
  AlpineSki = "AlpineSki",
  BackcountrySki = "BackcountrySki",
  Badminton = "Badminton",
  Canoeing = "Canoeing",
  Crossfit = "Crossfit",
  EBikeRide = "EBikeRide",
  Elliptical = "Elliptical",
  EMountainBikeRide = "EMountainBikeRide",
  Golf = "Golf",
  GravelRide = "GravelRide",
  Handcycle = "Handcycle",
  HighIntensityIntervalTraining = "HighIntensityIntervalTraining",
  Hike = "Hike",
  IceSkate = "IceSkate",
  InlineSkate = "InlineSkate",
  Kayaking = "Kayaking",
  Kitesurf = "Kitesurf",
  MountainBikeRide = "MountainBikeRide",
  NordicSki = "NordicSki",
  Pickleball = "Pickleball",
  Pilates = "Pilates",
  Racquetball = "Racquetball",
  Ride = "Ride",
  RockClimbing = "RockClimbing",
  RollerSki = "RollerSki",
  Rowing = "Rowing",
  Run = "Run",
  Sail = "Sail",
  Skateboard = "Skateboard",
  Snowboard = "Snowboard",
  Snowshoe = "Snowshoe",
  Soccer = "Soccer",
  Squash = "Squash",
  StairStepper = "StairStepper",
  StandUpPaddling = "StandUpPaddling",
  Surfing = "Surfing",
  Swim = "Swim",
  TableTennis = "TableTennis",
  Tennis = "Tennis",
  TrailRun = "TrailRun",
  Velomobile = "Velomobile",
  VirtualRide = "VirtualRide",
  VirtualRow = "VirtualRow",
  VirtualRun = "VirtualRun",
  Walk = "Walk",
  WeightTraining = "WeightTraining",
  Wheelchair = "Wheelchair",
  Windsurf = "Windsurf",
  Workout = "Workout",
  Yoga = "Yoga",
}

export type SummaryActivity = MetaActivity & {
  /** The identifier provided at upload time */
  external_id?: string;
  /**
   * The identifier of the upload that resulted in this activity
   * @format int64
   */
  upload_id?: number;
  athlete?: MetaAthlete;
  /** The name of the activity */
  name?: string;
  /**
   * The activity's distance, in meters
   * @format float
   */
  distance?: number;
  /** The activity's moving time, in seconds */
  moving_time?: number;
  /** The activity's elapsed time, in seconds */
  elapsed_time?: number;
  /**
   * The activity's total elevation gain.
   * @format float
   */
  total_elevation_gain?: number;
  /**
   * The activity's highest elevation, in meters
   * @format float
   */
  elev_high?: number;
  /**
   * The activity's lowest elevation, in meters
   * @format float
   */
  elev_low?: number;
  /** Deprecated. Prefer to use sport_type */
  type?: ActivityType;
  /** An enumeration of the sport types an activity may have. Distinct from ActivityType in that it has new types (e.g. MountainBikeRide) */
  sport_type?: SportType;
  /**
   * The time at which the activity was started.
   * @format date-time
   */
  start_date?: string;
  /**
   * The time at which the activity was started in the local timezone.
   * @format date-time
   */
  start_date_local?: string;
  /** The timezone of the activity */
  timezone?: string;
  /** A pair of latitude/longitude coordinates, represented as an array of 2 floating point numbers. */
  start_latlng?: LatLng;
  /** A pair of latitude/longitude coordinates, represented as an array of 2 floating point numbers. */
  end_latlng?: LatLng;
  /** The number of achievements gained during this activity */
  achievement_count?: number;
  /** The number of kudos given for this activity */
  kudos_count?: number;
  /** The number of comments for this activity */
  comment_count?: number;
  /**
   * The number of athletes for taking part in a group activity
   * @min 1
   */
  athlete_count?: number;
  /** The number of Instagram photos for this activity */
  photo_count?: number;
  /** The number of Instagram and Strava photos for this activity */
  total_photo_count?: number;
  map?: PolylineMap;
  /** Whether this activity was recorded on a training machine */
  trainer?: boolean;
  /** Whether this activity is a commute */
  commute?: boolean;
  /** Whether this activity was created manually */
  manual?: boolean;
  /** Whether this activity is private */
  private?: boolean;
  /** Whether this activity is flagged */
  flagged?: boolean;
  /** The activity's workout type */
  workout_type?: number;
  /** The unique identifier of the upload in string format */
  upload_id_str?: string;
  /**
   * The activity's average speed, in meters per second
   * @format float
   */
  average_speed?: number;
  /**
   * The activity's max speed, in meters per second
   * @format float
   */
  max_speed?: number;
  /** Whether the logged-in athlete has kudoed this activity */
  has_kudoed?: boolean;
  /** Whether the activity is muted */
  hide_from_home?: boolean;
  /** The id of the gear for the activity */
  gear_id?: string;
  /**
   * The total work done in kilojoules during this activity. Rides only
   * @format float
   */
  kilojoules?: number;
  /**
   * Average power output in watts during this activity. Rides only
   * @format float
   */
  average_watts?: number;
  /** Whether the watts are from a power meter, false if estimated */
  device_watts?: boolean;
  /** Rides with power meter data only */
  max_watts?: number;
  /** Similar to Normalized Power. Rides with power meter data only */
  weighted_average_watts?: number;
};

export interface PhotosSummary {
  /** The number of photos */
  count?: number;
  primary?: {
    /** @format int64 */
    id?: number;
    source?: number;
    unique_id?: string;
    urls?: Record<string, string>;
  };
}

export interface Split {
  /**
   * The average speed of this split, in meters per second
   * @format float
   */
  average_speed?: number;
  /**
   * The distance of this split, in meters
   * @format float
   */
  distance?: number;
  /** The elapsed time of this split, in seconds */
  elapsed_time?: number;
  /**
   * The elevation difference of this split, in meters
   * @format float
   */
  elevation_difference?: number;
  /** The pacing zone of this split */
  pace_zone?: number;
  /** The moving time of this split, in seconds */
  moving_time?: number;
  /** N/A */
  split?: number;
}

export interface Lap {
  /**
   * The unique identifier of this lap
   * @format int64
   */
  id?: number;
  activity?: MetaActivity;
  athlete?: MetaAthlete;
  /**
   * The lap's average cadence
   * @format float
   */
  average_cadence?: number;
  /**
   * The lap's average speed
   * @format float
   */
  average_speed?: number;
  /**
   * The lap's distance, in meters
   * @format float
   */
  distance?: number;
  /** The lap's elapsed time, in seconds */
  elapsed_time?: number;
  /** The start index of this effort in its activity's stream */
  start_index?: number;
  /** The end index of this effort in its activity's stream */
  end_index?: number;
  /** The index of this lap in the activity it belongs to */
  lap_index?: number;
  /**
   * The maximum speed of this lat, in meters per second
   * @format float
   */
  max_speed?: number;
  /** The lap's moving time, in seconds */
  moving_time?: number;
  /** The name of the lap */
  name?: string;
  /** The athlete's pace zone during this lap */
  pace_zone?: number;
  split?: number;
  /**
   * The time at which the lap was started.
   * @format date-time
   */
  start_date?: string;
  /**
   * The time at which the lap was started in the local timezone.
   * @format date-time
   */
  start_date_local?: string;
  /**
   * The elevation gain of this lap, in meters
   * @format float
   */
  total_elevation_gain?: number;
}

export type DetailedActivity = SummaryActivity & {
  /** The description of the activity */
  description?: string;
  photos?: PhotosSummary;
  gear?: SummaryGear;
  /**
   * The number of kilocalories consumed during this activity
   * @format float
   */
  calories?: number;
  segment_efforts?: DetailedSegmentEffort[];
  /** The name of the device used to record the activity */
  device_name?: string;
  /** The token used to embed a Strava activity */
  embed_token?: string;
  /** The splits of this activity in metric units (for runs) */
  splits_metric?: Split[];
  /** The splits of this activity in imperial units (for runs) */
  splits_standard?: Split[];
  laps?: Lap[];
  best_efforts?: DetailedSegmentEffort[];
};

export interface UpdatableActivity {
  /** Whether this activity is a commute */
  commute?: boolean;
  /** Whether this activity was recorded on a training machine */
  trainer?: boolean;
  /** Whether this activity is muted */
  hide_from_home?: boolean;
  /** The description of the activity */
  description?: string;
  /** The name of the activity */
  name?: string;
  /** Deprecated. Prefer to use sport_type. In a request where both type and sport_type are present, this field will be ignored */
  type?: ActivityType;
  /** An enumeration of the sport types an activity may have. Distinct from ActivityType in that it has new types (e.g. MountainBikeRide) */
  sport_type?: SportType;
  /** Identifier for the gear associated with the activity. ‘none’ clears gear from activity */
  gear_id?: string;
}

/** A union type representing the time spent in a given zone. */
export type TimedZoneRange = ZoneRange & {
  /** The number of seconds spent in this zone */
  time?: number;
};

/** Stores the exclusive ranges representing zones and the time spent in each. */
export type TimedZoneDistribution = TimedZoneRange[];

export interface ActivityZone {
  score?: number;
  /** Stores the exclusive ranges representing zones and the time spent in each. */
  distribution_buckets?: TimedZoneDistribution;
  type?: "heartrate" | "power";
  sensor_based?: boolean;
  points?: number;
  custom_zones?: boolean;
  max?: number;
}

export interface Comment {
  /**
   * The unique identifier of this comment
   * @format int64
   */
  id?: number;
  /**
   * The identifier of the activity this comment is related to
   * @format int64
   */
  activity_id?: number;
  /** The content of the comment */
  text?: string;
  athlete?: SummaryAthlete;
  /**
   * The time at which this comment was created.
   * @format date-time
   */
  created_at?: string;
}

export type DetailedClub = SummaryClub & {
  /** The membership status of the logged-in athlete. */
  membership?: "member" | "pending";
  /** Whether the currently logged-in athlete is an administrator of this club. */
  admin?: boolean;
  /** Whether the currently logged-in athlete is the owner of this club. */
  owner?: boolean;
  /** The number of athletes in the club that the logged-in athlete follows. */
  following_count?: number;
};

export interface ClubAthlete {
  /** Resource state, indicates level of detail. Possible values: 1 -> "meta", 2 -> "summary", 3 -> "detail" */
  resource_state?: number;
  /** The athlete's first name. */
  firstname?: string;
  /** The athlete's last initial. */
  lastname?: string;
  /** The athlete's member status. */
  member?: string;
  /** Whether the athlete is a club admin. */
  admin?: boolean;
  /** Whether the athlete is club owner. */
  owner?: boolean;
}

export interface ClubActivity {
  athlete?: MetaAthlete;
  /** The name of the activity */
  name?: string;
  /**
   * The activity's distance, in meters
   * @format float
   */
  distance?: number;
  /** The activity's moving time, in seconds */
  moving_time?: number;
  /** The activity's elapsed time, in seconds */
  elapsed_time?: number;
  /**
   * The activity's total elevation gain.
   * @format float
   */
  total_elevation_gain?: number;
  /** Deprecated. Prefer to use sport_type */
  type?: ActivityType;
  /** An enumeration of the sport types an activity may have. Distinct from ActivityType in that it has new types (e.g. MountainBikeRide) */
  sport_type?: SportType;
  /** The activity's workout type */
  workout_type?: number;
}

export type DetailedGear = SummaryGear & {
  /** The gear's brand name. */
  brand_name?: string;
  /** The gear's model name. */
  model_name?: string;
  /** The gear's frame type (bike only). */
  frame_type?: number;
  /** The gear's description. */
  description?: string;
};

export interface Waypoint {
  /** The location along the route that the waypoint is closest to */
  latlng?: LatLng;
  /** A location off of the route that the waypoint is (optional) */
  target_latlng?: LatLng;
  /**
   * Categories that the waypoint belongs to
   * @minItems 0
   */
  categories?: string[];
  /** A title for the waypoint */
  title?: string;
  /** A description of the waypoint (optional) */
  description?: string;
  /** The number meters along the route that the waypoint is located */
  distance_into_route?: number;
}

export interface Route {
  athlete?: SummaryAthlete;
  /** The description of the route */
  description?: string;
  /**
   * The route's distance, in meters
   * @format float
   */
  distance?: number;
  /**
   * The route's elevation gain.
   * @format float
   */
  elevation_gain?: number;
  /**
   * The unique identifier of this route
   * @format int64
   */
  id?: number;
  /** The unique identifier of the route in string format */
  id_str?: string;
  map?: PolylineMap;
  /** The name of this route */
  name?: string;
  /** Whether this route is private */
  private?: boolean;
  /** Whether this route is starred by the logged-in athlete */
  starred?: boolean;
  /** An epoch timestamp of when the route was created */
  timestamp?: number;
  /** This route's type (1 for ride, 2 for runs) */
  type?: number;
  /** This route's sub-type (1 for road, 2 for mountain bike, 3 for cross, 4 for trail, 5 for mixed) */
  sub_type?: number;
  /**
   * The time at which the route was created
   * @format date-time
   */
  created_at?: string;
  /**
   * The time at which the route was last updated
   * @format date-time
   */
  updated_at?: string;
  /** Estimated time in seconds for the authenticated athlete to complete route */
  estimated_moving_time?: number;
  /** The segments traversed by this route */
  segments?: SummarySegment[];
  /**
   * The custom waypoints along this route
   * @minItems 0
   */
  waypoints?: Waypoint[];
}

export interface Upload {
  /**
   * The unique identifier of the upload
   * @format int64
   */
  id?: number;
  /** The unique identifier of the upload in string format */
  id_str?: string;
  /** The external identifier of the upload */
  external_id?: string;
  /** The error associated with this upload */
  error?: string;
  /** The status of this upload */
  status?: string;
  /**
   * The identifier of the activity this upload resulted into
   * @format int64
   */
  activity_id?: number;
}

export interface BaseStream {
  /** The number of data points in this stream */
  original_size?: number;
  /** The level of detail (sampling) in which this stream was returned */
  resolution?: "low" | "medium" | "high";
  /** The base series used in the case the stream was downsampled */
  series_type?: "distance" | "time";
}

export type TimeStream = BaseStream & {
  /** The sequence of time values for this stream, in seconds */
  data?: number[];
};

export type DistanceStream = BaseStream & {
  /** The sequence of distance values for this stream, in meters */
  data?: number[];
};

export type LatLngStream = BaseStream & {
  /** The sequence of lat/long values for this stream */
  data?: LatLng[];
};

export type AltitudeStream = BaseStream & {
  /** The sequence of altitude values for this stream, in meters */
  data?: number[];
};

export type SmoothVelocityStream = BaseStream & {
  /** The sequence of velocity values for this stream, in meters per second */
  data?: number[];
};

export type HeartrateStream = BaseStream & {
  /** The sequence of heart rate values for this stream, in beats per minute */
  data?: number[];
};

export type CadenceStream = BaseStream & {
  /** The sequence of cadence values for this stream, in rotations per minute */
  data?: number[];
};

export type PowerStream = BaseStream & {
  /** The sequence of power values for this stream, in watts */
  data?: number[];
};

export type TemperatureStream = BaseStream & {
  /** The sequence of temperature values for this stream, in celsius degrees */
  data?: number[];
};

export type MovingStream = BaseStream & {
  /** The sequence of moving values for this stream, as boolean values */
  data?: boolean[];
};

export type SmoothGradeStream = BaseStream & {
  /** The sequence of grade values for this stream, as percents of a grade */
  data?: number[];
};

export interface StreamSet {
  time?: TimeStream;
  distance?: DistanceStream;
  latlng?: LatLngStream;
  altitude?: AltitudeStream;
  velocity_smooth?: SmoothVelocityStream;
  heartrate?: HeartrateStream;
  cadence?: CadenceStream;
  watts?: PowerStream;
  temp?: TemperatureStream;
  moving?: MovingStream;
  grade_smooth?: SmoothGradeStream;
}

export type QueryParamsType = Record<string | number, any>;
export type ResponseFormat = keyof Omit<Body, "body" | "bodyUsed">;

export interface FullRequestParams extends Omit<RequestInit, "body"> {
  /** set parameter to `true` for call `securityWorker` for this request */
  secure?: boolean;
  /** request path */
  path: string;
  /** content type of request body */
  type?: ContentType;
  /** query params */
  query?: QueryParamsType;
  /** format of response (i.e. response.json() -> format: "json") */
  format?: ResponseFormat;
  /** request body */
  body?: unknown;
  /** base url */
  baseUrl?: string;
  /** request cancellation token */
  cancelToken?: CancelToken;
}

export type RequestParams = Omit<FullRequestParams, "body" | "method" | "query" | "path">;

export interface ApiConfig<SecurityDataType = unknown> {
  baseUrl?: string;
  baseApiParams?: Omit<RequestParams, "baseUrl" | "cancelToken" | "signal">;
  securityWorker?: (securityData: SecurityDataType | null) => Promise<RequestParams | void> | RequestParams | void;
  customFetch?: typeof fetch;
}

export interface HttpResponse<D extends unknown, E extends unknown = unknown> extends Response {
  data: D;
  error: E;
}

type CancelToken = Symbol | string | number;

export enum ContentType {
  Json = "application/json",
  FormData = "multipart/form-data",
  UrlEncoded = "application/x-www-form-urlencoded",
  Text = "text/plain",
}

export class HttpClient<SecurityDataType = unknown> {
  public baseUrl: string = "https://www.strava.com/api/v3";
  private securityData: SecurityDataType | null = null;
  private securityWorker?: ApiConfig<SecurityDataType>["securityWorker"];
  private abortControllers = new Map<CancelToken, AbortController>();
  private customFetch = (...fetchParams: Parameters<typeof fetch>) => fetch(...fetchParams);

  private baseApiParams: RequestParams = {
    credentials: "same-origin",
    headers: {},
    redirect: "follow",
    referrerPolicy: "no-referrer",
  };

  constructor(apiConfig: ApiConfig<SecurityDataType> = {}) {
    Object.assign(this, apiConfig);
  }

  public setSecurityData = (data: SecurityDataType | null) => {
    this.securityData = data;
  };

  protected encodeQueryParam(key: string, value: any) {
    const encodedKey = encodeURIComponent(key);
    return `${encodedKey}=${encodeURIComponent(typeof value === "number" ? value : `${value}`)}`;
  }

  protected addQueryParam(query: QueryParamsType, key: string) {
    return this.encodeQueryParam(key, query[key]);
  }

  protected addArrayQueryParam(query: QueryParamsType, key: string) {
    const value = query[key];
    return value.map((v: any) => this.encodeQueryParam(key, v)).join("&");
  }

  protected toQueryString(rawQuery?: QueryParamsType): string {
    const query = rawQuery || {};
    const keys = Object.keys(query).filter((key) => "undefined" !== typeof query[key]);
    return keys
      .map((key) => (Array.isArray(query[key]) ? this.addArrayQueryParam(query, key) : this.addQueryParam(query, key)))
      .join("&");
  }

  protected addQueryParams(rawQuery?: QueryParamsType): string {
    const queryString = this.toQueryString(rawQuery);
    return queryString ? `?${queryString}` : "";
  }

  private contentFormatters: Record<ContentType, (input: any) => any> = {
    [ContentType.Json]: (input: any) =>
      input !== null && (typeof input === "object" || typeof input === "string") ? JSON.stringify(input) : input,
    [ContentType.Text]: (input: any) => (input !== null && typeof input !== "string" ? JSON.stringify(input) : input),
    [ContentType.FormData]: (input: any) =>
      Object.keys(input || {}).reduce((formData, key) => {
        const property = input[key];
        formData.append(
          key,
          property instanceof Blob
            ? property
            : typeof property === "object" && property !== null
              ? JSON.stringify(property)
              : `${property}`,
        );
        return formData;
      }, new FormData()),
    [ContentType.UrlEncoded]: (input: any) => this.toQueryString(input),
  };

  protected mergeRequestParams(params1: RequestParams, params2?: RequestParams): RequestParams {
    return {
      ...this.baseApiParams,
      ...params1,
      ...(params2 || {}),
      headers: {
        ...(this.baseApiParams.headers || {}),
        ...(params1.headers || {}),
        ...((params2 && params2.headers) || {}),
      },
    };
  }

  protected createAbortSignal = (cancelToken: CancelToken): AbortSignal | undefined => {
    if (this.abortControllers.has(cancelToken)) {
      const abortController = this.abortControllers.get(cancelToken);
      if (abortController) {
        return abortController.signal;
      }
      return void 0;
    }

    const abortController = new AbortController();
    this.abortControllers.set(cancelToken, abortController);
    return abortController.signal;
  };

  public abortRequest = (cancelToken: CancelToken) => {
    const abortController = this.abortControllers.get(cancelToken);

    if (abortController) {
      abortController.abort();
      this.abortControllers.delete(cancelToken);
    }
  };

  public request = async <T = any, E = any>({
    body,
    secure,
    path,
    type,
    query,
    format,
    baseUrl,
    cancelToken,
    ...params
  }: FullRequestParams): Promise<HttpResponse<T, E>> => {
    const secureParams =
      ((typeof secure === "boolean" ? secure : this.baseApiParams.secure) &&
        this.securityWorker &&
        (await this.securityWorker(this.securityData))) ||
      {};
    const requestParams = this.mergeRequestParams(params, secureParams);
    const queryString = query && this.toQueryString(query);
    const payloadFormatter = this.contentFormatters[type || ContentType.Json];
    const responseFormat = format || requestParams.format;

    return this.customFetch(`${baseUrl || this.baseUrl || ""}${path}${queryString ? `?${queryString}` : ""}`, {
      ...requestParams,
      headers: {
        ...(requestParams.headers || {}),
        ...(type && type !== ContentType.FormData ? { "Content-Type": type } : {}),
      },
      signal: (cancelToken ? this.createAbortSignal(cancelToken) : requestParams.signal) || null,
      body: typeof body === "undefined" || body === null ? null : payloadFormatter(body),
    }).then(async (response) => {
      const r = response.clone() as HttpResponse<T, E>;
      r.data = null as unknown as T;
      r.error = null as unknown as E;

      const data = !responseFormat
        ? r
        : await response[responseFormat]()
            .then((data) => {
              if (r.ok) {
                r.data = data;
              } else {
                r.error = data;
              }
              return r;
            })
            .catch((e) => {
              r.error = e;
              return r;
            });

      if (cancelToken) {
        this.abortControllers.delete(cancelToken);
      }

      if (!response.ok) throw data;
      return data;
    });
  };
}

/**
 * @title Strava API v3
 * @version 3.0.0
 * @baseUrl https://www.strava.com/api/v3
 *
 * The [Swagger Playground](https://developers.strava.com/playground) is the easiest way to familiarize yourself with the Strava API by submitting HTTP requests and observing the responses before you write any client code. It will show what a response will look like with different endpoints depending on the authorization scope you receive from your athletes. To use the Playground, go to https://www.strava.com/settings/api and change your “Authorization Callback Domain” to developers.strava.com. Please note, we only support Swagger 2.0. There is a known issue where you can only select one scope at a time. For more information, please check the section “client code” at https://developers.strava.com/docs.
 */
export class Api<SecurityDataType extends unknown> extends HttpClient<SecurityDataType> {
  athletes = {
    /**
     * @description Returns the activity stats of an athlete. Only includes data from activities set to Everyone visibilty.
     *
     * @tags Athletes
     * @name GetStats
     * @summary Get Athlete Stats
     * @request GET:/athletes/{id}/stats
     * @secure
     */
    getStats: (id: number, params: RequestParams = {}) =>
      this.request<ActivityStats, Fault>({
        path: `/athletes/${id}/stats`,
        method: "GET",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * @description Returns a list of the routes created by the authenticated athlete. Private routes are filtered out unless requested by a token with read_all scope.
     *
     * @tags Routes
     * @name GetRoutesByAthleteId
     * @summary List Athlete Routes
     * @request GET:/athletes/{id}/routes
     * @secure
     */
    getRoutesByAthleteId: (
      id: string,
      query?: {
        /** Page number. Defaults to 1. */
        page?: number;
        /**
         * Number of items per page. Defaults to 30.
         * @default 30
         */
        per_page?: number;
      },
      params: RequestParams = {},
    ) =>
      this.request<Route[], Fault>({
        path: `/athletes/${id}/routes`,
        method: "GET",
        query: query,
        secure: true,
        format: "json",
        ...params,
      }),
  };
  athlete = {
    /**
     * @description Returns the currently authenticated athlete. Tokens with profile:read_all scope will receive a detailed athlete representation; all others will receive a summary representation.
     *
     * @tags Athletes
     * @name GetLoggedInAthlete
     * @summary Get Authenticated Athlete
     * @request GET:/athlete
     * @secure
     */
    getLoggedInAthlete: (params: RequestParams = {}) =>
      this.request<DetailedAthlete, Fault>({
        path: `/athlete`,
        method: "GET",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * @description Update the currently authenticated athlete. Requires profile:write scope.
     *
     * @tags Athletes
     * @name UpdateLoggedInAthlete
     * @summary Update Athlete
     * @request PUT:/athlete
     * @secure
     */
    updateLoggedInAthlete: (weight: number, data?: any, params: RequestParams = {}) =>
      this.request<DetailedAthlete, Fault>({
        path: `/athlete`,
        method: "PUT",
        body: data,
        secure: true,
        type: ContentType.FormData,
        format: "json",
        ...params,
      }),

    /**
     * @description Returns the the authenticated athlete's heart rate and power zones. Requires profile:read_all.
     *
     * @tags Athletes
     * @name GetLoggedInAthleteZones
     * @summary Get Zones
     * @request GET:/athlete/zones
     * @secure
     */
    getLoggedInAthleteZones: (params: RequestParams = {}) =>
      this.request<Zones, Fault>({
        path: `/athlete/zones`,
        method: "GET",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * @description Returns the activities of an athlete for a specific identifier. Requires activity:read. Only Me activities will be filtered out unless requested by a token with activity:read_all.
     *
     * @tags Activities
     * @name GetLoggedInAthleteActivities
     * @summary List Athlete Activities
     * @request GET:/athlete/activities
     * @secure
     */
    getLoggedInAthleteActivities: (
      query?: {
        /** An epoch timestamp to use for filtering activities that have taken place before a certain time. */
        before?: number;
        /** An epoch timestamp to use for filtering activities that have taken place after a certain time. */
        after?: number;
        /** Page number. Defaults to 1. */
        page?: number;
        /**
         * Number of items per page. Defaults to 30.
         * @default 30
         */
        per_page?: number;
      },
      params: RequestParams = {},
    ) =>
      this.request<SummaryActivity[], Fault>({
        path: `/athlete/activities`,
        method: "GET",
        query: query,
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * @description Returns a list of the clubs whose membership includes the authenticated athlete.
     *
     * @tags Clubs
     * @name GetLoggedInAthleteClubs
     * @summary List Athlete Clubs
     * @request GET:/athlete/clubs
     * @secure
     */
    getLoggedInAthleteClubs: (
      query?: {
        /** Page number. Defaults to 1. */
        page?: number;
        /**
         * Number of items per page. Defaults to 30.
         * @default 30
         */
        per_page?: number;
      },
      params: RequestParams = {},
    ) =>
      this.request<SummaryClub[], Fault>({
        path: `/athlete/clubs`,
        method: "GET",
        query: query,
        secure: true,
        format: "json",
        ...params,
      }),
  };
  segments = {
    /**
     * @description Returns the specified segment. read_all scope required in order to retrieve athlete-specific segment information, or to retrieve private segments.
     *
     * @tags Segments
     * @name GetSegmentById
     * @summary Get Segment
     * @request GET:/segments/{id}
     * @secure
     */
    getSegmentById: (id: number, params: RequestParams = {}) =>
      this.request<DetailedSegment, Fault>({
        path: `/segments/${id}`,
        method: "GET",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * @description List of the authenticated athlete's starred segments. Private segments are filtered out unless requested by a token with read_all scope.
     *
     * @tags Segments
     * @name GetLoggedInAthleteStarredSegments
     * @summary List Starred Segments
     * @request GET:/segments/starred
     * @secure
     */
    getLoggedInAthleteStarredSegments: (
      query?: {
        /** Page number. Defaults to 1. */
        page?: number;
        /**
         * Number of items per page. Defaults to 30.
         * @default 30
         */
        per_page?: number;
      },
      params: RequestParams = {},
    ) =>
      this.request<SummarySegment[], Fault>({
        path: `/segments/starred`,
        method: "GET",
        query: query,
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * @description Stars/Unstars the given segment for the authenticated athlete. Requires profile:write scope.
     *
     * @tags Segments
     * @name StarSegment
     * @summary Star Segment
     * @request PUT:/segments/{id}/starred
     * @secure
     */
    starSegment: (
      id: number,
      data: {
        /**
         * If true, star the segment; if false, unstar the segment.
         * @default false
         */
        starred: boolean;
      },
      params: RequestParams = {},
    ) =>
      this.request<DetailedSegment, Fault>({
        path: `/segments/${id}/starred`,
        method: "PUT",
        body: data,
        secure: true,
        type: ContentType.FormData,
        format: "json",
        ...params,
      }),

    /**
     * @description Returns the top 10 segments matching a specified query.
     *
     * @tags Segments
     * @name ExploreSegments
     * @summary Explore segments
     * @request GET:/segments/explore
     * @secure
     */
    exploreSegments: (
      query: {
        /**
         * The latitude and longitude for two points describing a rectangular boundary for the search: [southwest corner latitutde, southwest corner longitude, northeast corner latitude, northeast corner longitude]
         * @maxItems 4
         * @minItems 4
         */
        bounds: number[];
        /** Desired activity type. */
        activity_type?: "running" | "riding";
        /**
         * The minimum climbing category.
         * @min 0
         * @max 5
         */
        min_cat?: number;
        /**
         * The maximum climbing category.
         * @min 0
         * @max 5
         */
        max_cat?: number;
      },
      params: RequestParams = {},
    ) =>
      this.request<ExplorerResponse, Fault>({
        path: `/segments/explore`,
        method: "GET",
        query: query,
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * @description Returns the given segment's streams. Requires read_all scope for private segments.
     *
     * @tags Streams
     * @name GetSegmentStreams
     * @summary Get Segment Streams
     * @request GET:/segments/{id}/streams
     * @secure
     */
    getSegmentStreams: (
      id: number,
      query: {
        /**
         * The types of streams to return.
         * @minItems 1
         */
        keys: ("distance" | "latlng" | "altitude")[];
        /**
         * Must be true.
         * @default true
         */
        key_by_type: boolean;
      },
      params: RequestParams = {},
    ) =>
      this.request<StreamSet, Fault>({
        path: `/segments/${id}/streams`,
        method: "GET",
        query: query,
        secure: true,
        format: "json",
        ...params,
      }),
  };
  segmentEfforts = {
    /**
     * @description Returns a set of the authenticated athlete's segment efforts for a given segment.  Requires subscription.
     *
     * @tags SegmentEfforts
     * @name GetEffortsBySegmentId
     * @summary List Segment Efforts
     * @request GET:/segment_efforts
     * @secure
     */
    getEffortsBySegmentId: (
      query: {
        /** The identifier of the segment. */
        segment_id: number;
        /**
         * ISO 8601 formatted date time.
         * @format date-time
         */
        start_date_local?: string;
        /**
         * ISO 8601 formatted date time.
         * @format date-time
         */
        end_date_local?: string;
        /**
         * Number of items per page. Defaults to 30.
         * @default 30
         */
        per_page?: number;
      },
      params: RequestParams = {},
    ) =>
      this.request<DetailedSegmentEffort[], Fault>({
        path: `/segment_efforts`,
        method: "GET",
        query: query,
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * @description Returns a segment effort from an activity that is owned by the authenticated athlete. Requires subscription.
     *
     * @tags SegmentEfforts
     * @name GetSegmentEffortById
     * @summary Get Segment Effort
     * @request GET:/segment_efforts/{id}
     * @secure
     */
    getSegmentEffortById: (id: number, params: RequestParams = {}) =>
      this.request<DetailedSegmentEffort, Fault>({
        path: `/segment_efforts/${id}`,
        method: "GET",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * @description Returns a set of streams for a segment effort completed by the authenticated athlete. Requires read_all scope.
     *
     * @tags Streams
     * @name GetSegmentEffortStreams
     * @summary Get Segment Effort Streams
     * @request GET:/segment_efforts/{id}/streams
     * @secure
     */
    getSegmentEffortStreams: (
      id: number,
      query: {
        /**
         * The types of streams to return.
         * @minItems 1
         */
        keys: (
          | "time"
          | "distance"
          | "latlng"
          | "altitude"
          | "velocity_smooth"
          | "heartrate"
          | "cadence"
          | "watts"
          | "temp"
          | "moving"
          | "grade_smooth"
        )[];
        /**
         * Must be true.
         * @default true
         */
        key_by_type: boolean;
      },
      params: RequestParams = {},
    ) =>
      this.request<StreamSet, Fault>({
        path: `/segment_efforts/${id}/streams`,
        method: "GET",
        query: query,
        secure: true,
        format: "json",
        ...params,
      }),
  };
  activities = {
    /**
     * @description Creates a manual activity for an athlete, requires activity:write scope.
     *
     * @tags Activities
     * @name CreateActivity
     * @summary Create an Activity
     * @request POST:/activities
     * @secure
     */
    createActivity: (
      data: {
        /** The name of the activity. */
        name: string;
        /** Type of activity. For example - Run, Ride etc. */
        type?: string;
        /** Sport type of activity. For example - Run, MountainBikeRide, Ride, etc. */
        sport_type: string;
        /**
         * ISO 8601 formatted date time.
         * @format date-time
         */
        start_date_local: string;
        /** In seconds. */
        elapsed_time: number;
        /** Description of the activity. */
        description?: string;
        /**
         * In meters.
         * @format float
         */
        distance?: number;
        /** Set to 1 to mark as a trainer activity. */
        trainer?: number;
        /** Set to 1 to mark as commute. */
        commute?: number;
      },
      params: RequestParams = {},
    ) =>
      this.request<DetailedActivity, Fault>({
        path: `/activities`,
        method: "POST",
        body: data,
        secure: true,
        type: ContentType.UrlEncoded,
        format: "json",
        ...params,
      }),

    /**
     * @description Returns the given activity that is owned by the authenticated athlete. Requires activity:read for Everyone and Followers activities. Requires activity:read_all for Only Me activities.
     *
     * @tags Activities
     * @name GetActivityById
     * @summary Get Activity
     * @request GET:/activities/{id}
     * @secure
     */
    getActivityById: (
      id: number,
      query?: {
        /** To include all segments efforts. */
        include_all_efforts?: boolean;
      },
      params: RequestParams = {},
    ) =>
      this.request<DetailedActivity, Fault>({
        path: `/activities/${id}`,
        method: "GET",
        query: query,
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * @description Updates the given activity that is owned by the authenticated athlete. Requires activity:write. Also requires activity:read_all in order to update Only Me activities
     *
     * @tags Activities
     * @name UpdateActivityById
     * @summary Update Activity
     * @request PUT:/activities/{id}
     * @secure
     */
    updateActivityById: (id: number, body: UpdatableActivity, params: RequestParams = {}) =>
      this.request<DetailedActivity, Fault>({
        path: `/activities/${id}`,
        method: "PUT",
        body: body,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * @description Returns the laps of an activity identified by an identifier. Requires activity:read for Everyone and Followers activities. Requires activity:read_all for Only Me activities.
     *
     * @tags Activities
     * @name GetLapsByActivityId
     * @summary List Activity Laps
     * @request GET:/activities/{id}/laps
     * @secure
     */
    getLapsByActivityId: (id: number, params: RequestParams = {}) =>
      this.request<Lap[], Fault>({
        path: `/activities/${id}/laps`,
        method: "GET",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * @description Summit Feature. Returns the zones of a given activity. Requires activity:read for Everyone and Followers activities. Requires activity:read_all for Only Me activities.
     *
     * @tags Activities
     * @name GetZonesByActivityId
     * @summary Get Activity Zones
     * @request GET:/activities/{id}/zones
     * @secure
     */
    getZonesByActivityId: (id: number, params: RequestParams = {}) =>
      this.request<ActivityZone[], Fault>({
        path: `/activities/${id}/zones`,
        method: "GET",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * @description Returns the comments on the given activity. Requires activity:read for Everyone and Followers activities. Requires activity:read_all for Only Me activities.
     *
     * @tags Activities
     * @name GetCommentsByActivityId
     * @summary List Activity Comments
     * @request GET:/activities/{id}/comments
     * @secure
     */
    getCommentsByActivityId: (
      id: number,
      query?: {
        /** Deprecated. Prefer to use after_cursor. */
        page?: number;
        /**
         * Deprecated. Prefer to use page_size.
         * @default 30
         */
        per_page?: number;
        /**
         * Number of items per page. Defaults to 30.
         * @default 30
         */
        page_size?: number;
        /** Cursor of the last item in the previous page of results, used to request the subsequent page of results.  When omitted, the first page of results is fetched. */
        after_cursor?: string;
      },
      params: RequestParams = {},
    ) =>
      this.request<Comment[], Fault>({
        path: `/activities/${id}/comments`,
        method: "GET",
        query: query,
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * @description Returns the athletes who kudoed an activity identified by an identifier. Requires activity:read for Everyone and Followers activities. Requires activity:read_all for Only Me activities.
     *
     * @tags Activities
     * @name GetKudoersByActivityId
     * @summary List Activity Kudoers
     * @request GET:/activities/{id}/kudos
     * @secure
     */
    getKudoersByActivityId: (
      id: number,
      query?: {
        /** Page number. Defaults to 1. */
        page?: number;
        /**
         * Number of items per page. Defaults to 30.
         * @default 30
         */
        per_page?: number;
      },
      params: RequestParams = {},
    ) =>
      this.request<SummaryAthlete[], Fault>({
        path: `/activities/${id}/kudos`,
        method: "GET",
        query: query,
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * @description Returns the given activity's streams. Requires activity:read scope. Requires activity:read_all scope for Only Me activities.
     *
     * @tags Streams
     * @name GetActivityStreams
     * @summary Get Activity Streams
     * @request GET:/activities/{id}/streams
     * @secure
     */
    getActivityStreams: (
      id: number,
      query: {
        /**
         * Desired stream types.
         * @minItems 1
         */
        keys: (
          | "time"
          | "distance"
          | "latlng"
          | "altitude"
          | "velocity_smooth"
          | "heartrate"
          | "cadence"
          | "watts"
          | "temp"
          | "moving"
          | "grade_smooth"
        )[];
        /**
         * Must be true.
         * @default true
         */
        key_by_type: boolean;
      },
      params: RequestParams = {},
    ) =>
      this.request<StreamSet, Fault>({
        path: `/activities/${id}/streams`,
        method: "GET",
        query: query,
        secure: true,
        format: "json",
        ...params,
      }),
  };
  clubs = {
    /**
     * @description Returns a given club using its identifier.
     *
     * @tags Clubs
     * @name GetClubById
     * @summary Get Club
     * @request GET:/clubs/{id}
     * @secure
     */
    getClubById: (id: number, params: RequestParams = {}) =>
      this.request<DetailedClub, Fault>({
        path: `/clubs/${id}`,
        method: "GET",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * @description Returns a list of the athletes who are members of a given club.
     *
     * @tags Clubs
     * @name GetClubMembersById
     * @summary List Club Members
     * @request GET:/clubs/{id}/members
     * @secure
     */
    getClubMembersById: (
      id: number,
      query?: {
        /** Page number. Defaults to 1. */
        page?: number;
        /**
         * Number of items per page. Defaults to 30.
         * @default 30
         */
        per_page?: number;
      },
      params: RequestParams = {},
    ) =>
      this.request<ClubAthlete[], Fault>({
        path: `/clubs/${id}/members`,
        method: "GET",
        query: query,
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * @description Returns a list of the administrators of a given club.
     *
     * @tags Clubs
     * @name GetClubAdminsById
     * @summary List Club Administrators
     * @request GET:/clubs/{id}/admins
     * @secure
     */
    getClubAdminsById: (
      id: number,
      query?: {
        /** Page number. Defaults to 1. */
        page?: number;
        /**
         * Number of items per page. Defaults to 30.
         * @default 30
         */
        per_page?: number;
      },
      params: RequestParams = {},
    ) =>
      this.request<SummaryAthlete[], Fault>({
        path: `/clubs/${id}/admins`,
        method: "GET",
        query: query,
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * @description Retrieve recent activities from members of a specific club. The authenticated athlete must belong to the requested club in order to hit this endpoint. Pagination is supported. Athlete profile visibility is respected for all activities.
     *
     * @tags Clubs
     * @name GetClubActivitiesById
     * @summary List Club Activities
     * @request GET:/clubs/{id}/activities
     * @secure
     */
    getClubActivitiesById: (
      id: number,
      query?: {
        /** Page number. Defaults to 1. */
        page?: number;
        /**
         * Number of items per page. Defaults to 30.
         * @default 30
         */
        per_page?: number;
      },
      params: RequestParams = {},
    ) =>
      this.request<ClubActivity[], Fault>({
        path: `/clubs/${id}/activities`,
        method: "GET",
        query: query,
        secure: true,
        format: "json",
        ...params,
      }),
  };
  gear = {
    /**
     * @description Returns an equipment using its identifier.
     *
     * @tags Gears
     * @name GetGearById
     * @summary Get Equipment
     * @request GET:/gear/{id}
     * @secure
     */
    getGearById: (id: string, params: RequestParams = {}) =>
      this.request<DetailedGear, Fault>({
        path: `/gear/${id}`,
        method: "GET",
        secure: true,
        format: "json",
        ...params,
      }),
  };
  routes = {
    /**
     * @description Returns a route using its identifier. Requires read_all scope for private routes.
     *
     * @tags Routes
     * @name GetRouteById
     * @summary Get Route
     * @request GET:/routes/{id}
     * @secure
     */
    getRouteById: (id: number, params: RequestParams = {}) =>
      this.request<Route, Fault>({
        path: `/routes/${id}`,
        method: "GET",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * @description Returns a GPX file of the route. Requires read_all scope for private routes.
     *
     * @tags Routes
     * @name GetRouteAsGpx
     * @summary Export Route GPX
     * @request GET:/routes/{id}/export_gpx
     * @secure
     */
    getRouteAsGpx: (id: number, params: RequestParams = {}) =>
      this.request<File, Fault>({
        path: `/routes/${id}/export_gpx`,
        method: "GET",
        secure: true,
        ...params,
      }),

    /**
     * @description Returns a TCX file of the route. Requires read_all scope for private routes.
     *
     * @tags Routes
     * @name GetRouteAsTcx
     * @summary Export Route TCX
     * @request GET:/routes/{id}/export_tcx
     * @secure
     */
    getRouteAsTcx: (id: number, params: RequestParams = {}) =>
      this.request<File, Fault>({
        path: `/routes/${id}/export_tcx`,
        method: "GET",
        secure: true,
        ...params,
      }),

    /**
     * @description Returns the given route's streams. Requires read_all scope for private routes.
     *
     * @tags Streams
     * @name GetRouteStreams
     * @summary Get Route Streams
     * @request GET:/routes/{id}/streams
     * @secure
     */
    getRouteStreams: (id: number, params: RequestParams = {}) =>
      this.request<StreamSet, Fault>({
        path: `/routes/${id}/streams`,
        method: "GET",
        secure: true,
        format: "json",
        ...params,
      }),
  };
  uploads = {
    /**
     * @description Uploads a new data file to create an activity from. Requires activity:write scope.
     *
     * @tags Uploads
     * @name CreateUpload
     * @summary Upload Activity
     * @request POST:/uploads
     * @secure
     */
    createUpload: (
      data: {
        /**
         * The uploaded file.
         * @format binary
         */
        file?: File;
        /** The desired name of the resulting activity. */
        name?: string;
        /** The desired description of the resulting activity. */
        description?: string;
        /** Whether the resulting activity should be marked as having been performed on a trainer. */
        trainer?: string;
        /** Whether the resulting activity should be tagged as a commute. */
        commute?: string;
        /** The format of the uploaded file. */
        data_type?: "fit" | "fit.gz" | "tcx" | "tcx.gz" | "gpx" | "gpx.gz";
        /** The desired external identifier of the resulting activity. */
        external_id?: string;
      },
      params: RequestParams = {},
    ) =>
      this.request<Upload, Fault>({
        path: `/uploads`,
        method: "POST",
        body: data,
        secure: true,
        type: ContentType.FormData,
        format: "json",
        ...params,
      }),

    /**
     * @description Returns an upload for a given identifier. Requires activity:write scope.
     *
     * @tags Uploads
     * @name GetUploadById
     * @summary Get Upload
     * @request GET:/uploads/{uploadId}
     * @secure
     */
    getUploadById: (uploadId: number, params: RequestParams = {}) =>
      this.request<Upload, Fault>({
        path: `/uploads/${uploadId}`,
        method: "GET",
        secure: true,
        format: "json",
        ...params,
      }),
  };
}
