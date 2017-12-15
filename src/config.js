// Simulation constants
export const NUM_BLOBS = 50;
export const NUM_FOOD = 100;
export const WIDTH = 1000;
export const HEIGHT = 1000;
export const MAX_SPEED = 5;
export const FOOD_SIZE = 5;
export const INITIAL_BLOB_SIZE = 10;

// Simulation end conditions
// possible end conditions: TIME, NUM, SIZE, DEPTH, NONE (default)
export const END_CONDITIONS = ["DEPTH", "NUM"];
export const TIME_THRESHOLD = 15;
export const NUM_THRESHOLD = 2;
export const SIZE_THRESHOLD = 50;
export const DEPTH_THRESHOLD = 1000;

// Network constants
// possible inputs: SIZE, POS, VEL, CONS, PRED, FOOD, BLOB
export const INPUTS = ["POS", "VEL", "CONS", "PRED"];
export const NETWORK_DIMENSIONS = [10, [16, 16, 16, 16], 2];

// Fitness factors
export const SIZE_FACTOR = 0;
export const TIME_FACTOR = 1;
export const DEGREE = 2;

// Genetic factors
export const GENETIC_CROSSOVER = 0.50; // Genetic material of parent 2
export const MUTATION_RATE = 0.02; // Percentage chance a gene will mutate
export const MUTATION_RANGE = 0.20; // The multiplier of the mutation
export const ELITISM = 0.02; // The entities that are preserved as is for the next generation
export const NEW_ENTITIES = 0.10; // Entirely new random entities
