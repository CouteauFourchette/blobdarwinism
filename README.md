# Blob Darwinism

### Blob Darwinism is a web application that uses machine learning to simulate an ecosystem of independent agents called blobs.

## Background and Overview

Simulating a competitive, multi-agent environment is a problem for which machine learning a natural application.

In Blob Darwinism, we seek to demonstrate the power of machine learning by governing the behavior of blobs with a neural network. Each blob has a its own unique survival strategy and life cycle, and future generations of blobs inherit the behavior of their parents. Successful blobs have a greater likelihood of reproduction and thus blobs evolve optimal behavior over time.

Users will be able to manipulate various simulation variables, including the number of blobs, the size of the environment, and the abundance of food. Other variables, also exposed to the user, will alter the machine learning algorithm itself.

## Functionality & MVP

   - [ ] Render a dynamic environment of blobs
   - [ ] Control blob behavior with a neural network
   - [ ] Update child blobs behavior using a genetic algorithm
   - [ ] Provide a frontend interface for users to change simulation variables

#### Bonus Features
   - [ ] Add new classifications of blobs with distinct behavior (e.g. herbivores and carnivores)
   - [ ] Follow current best blob with camera
   - [ ] Enhance visuals and add visual effects
   - [ ] Port the app to another platform (Electron)

## Technologies & Technical Challenges
  ##### Frontend: JavaScript, WebGL
  #### Libraries: Synapse.js

#### Simulation Constraints
  + #### Rules:
    + Any blob can eat food. Food is a stationary entity that increased size by a small constant value.
    + Large blobs can eat smaller blobs and doing so increases its size by the size of the small blob.
    + Each frame, blobs apply an acceleration vector to its velocity.
    + There is a maximum velocity that is a linear function of size.
  + #### Variables:
    + Number of blobs in each generation
    + Abundance of food in each generation
    + Initial size of blobs
    + Size bonus awarded by eating food
    + Dimensions of the environment

#### Neural Network
  + ##### Input
    + Position & size of nearest consumable entity (food or blob) - 3 neurons
    + Position & size of nearest predator (larger blob) - 3 neurons
    + Own position - 2 neurons

  + #### Hidden Layer
    + To be determined empirically or provided by user

  + ##### Output
    + Acceleration vector - 2 neurons

#### Genetic Algorithm
  + ##### Updating the neural network
    Neural networks are traditionally updated using a back-propagating algorithm that computes some error delta and uses that to alter the weights at each neuron. Blob Darwinism will not use this approach because we simply do not have a dataset of "correct" acceleration vectors corresponding to a set of inputs with which to train the neural network.

    Instead, we will use a genetic algorithm to update these weights between generations. This means that an individual blob will not itself learn or improve, but will pass down its behavior (weights) genetically with some probability. This probability is equal to a blob's normalized "fitness," a heuristic which reflects the blobs success and is a function of its size and survival duration.

    The following is [our demo](https://couteaufourchette.github.io/blobgeneticdemo/) of the described demo algorithm.
