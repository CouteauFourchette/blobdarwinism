// Simulation constants
export const NUM_BLOBS = 20;
export const NUM_FOOD = 200;
export const WIDTH = 1600;
export const HEIGHT = 1200;
export const MAX_SPEED = 1;
export const FOOD_SIZE = 2;
export const INITIAL_BLOB_SIZE = 5;

// Simulation end conditions
export const END_CONDITIONS = ["TIME", "NUM"];
export const TIME_THRESHOLD = 15;
export const NUM_THRESHOLD = 1;
export const SIZE_THRESHOLD = 50;

export const NETWORK_DIMENSIONS = [10, [16, 16], 2];

// Fitness factors
export const SIZE_FACTOR = 2;
export const TIME_FACTOR = 2;

// Genetic factors
export const GENETIC_CROSSOVER = 0.50; // Genetic material of parent 2
export const MUTATION_RATE = 0.02; // Percentage chance a gene will mutate
export const MUTATION_RANGE = 0.20; // The multiplier of the mutation
export const ELITISM = 0.02; // The entities that are preserved as is for the next generation
export const NEW_ENTITIES = 0.01; // Entirely new random entities