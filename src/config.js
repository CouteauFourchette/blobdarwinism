// Simulation constants
export const NUM_BLOBS = 50;
export const NUM_FOOD = 201;
export const WIDTH = 2000;
export const HEIGHT = 2000;
export const MAX_SPEED = 5;
export const FOOD_SIZE = 5;
export const INITIAL_BLOB_SIZE = 10;

// Simulation end conditions
// possible end conditions: TIME, NUM, SIZE, DEPTH, NONE (default)
export const END_CONDITIONS = ["TIME", "NUM"];
export const TIME_THRESHOLD = 15;
export const NUM_THRESHOLD = 1;
export const SIZE_THRESHOLD = 50;
export const DEPTH_THRESHOLD = 1000;

// Network constants
// possible inputs: SIZE, POS, VEL, CONS, PRED, FOOD, BLOB
export const INPUTS = ["SIZE", "POS", "VEL", "FOOD", "BLOB", "PRED"];
export const NETWORK_DIMENSIONS = [13, [16, 16, 16, 16], 2];

// Fitness factors
export const SIZE_FACTOR = 1;
export const TIME_FACTOR = 1;
export const DEGREE = 3;

// Genetic factors
export const GENETIC_CROSSOVER = 0.50; // Genetic material of parent 2
export const MUTATION_RATE = 0.01; // Percentage chance a gene will mutate
export const MUTATION_RANGE = 0.20; // The multiplier of the mutation
export const ELITISM = 0.02; // The entities that are preserved as is for the next generation
export const NEW_ENTITIES = 0.05; // Entirely new random entities
