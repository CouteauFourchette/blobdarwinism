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
   - [ ] Enhance visuals and provide sound effects
   - [ ] Port the app to another platform (React Native or Electron)

## Technologies & Technical Challenges
  ##### Backend: Flask
  ##### Frontend: React/JavaScript

#### Simulation Constraints
  + #### Rules:
    + Any blob can eat food. Food is a stationary entity that increased size by one.
    + Large blobs can eat smaller blobs and doing so increases its size by the size of the small blob.
    + Each frame, blobs apply an acceleration vector to its velocity.
    + There is a maximum velocity that is a linear function of size.
  + #### Variables:
    + Number of blobs in each generation
    + Abundance of food in each generation
    + Initial size of blobs

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


## Accomplished over the Weekend
 - Research machine learning topics including neural networks and genetic algorithms
 - Determine the rules and and constraints of our simulation
 - Create the project skeleton
 - Write the underlying "game logic" necessary for the simulation to run

## Group Members & Work Breakdown

**Julien Gurunlian**,
**Garrett Tongue**,
**Brandt Sheets**,

### Day 1
  - decide tags
  - SQL queries/ python exclusion script that filters out songs with conflicting tags **ALEC**
  - a properly populated entry into database **ADOM**
    * take some audio
    * convert and analyze with full suite of features
    * parse and join back with tag
  - complete MNIST tutorial **ANDREW**

### Day 2
  - scripting the population process (one at a time) **ADOM**
    - get song name and tag from MSD (D1)
    - make API call to Spotify with song name (D1) **ALEC**
    - buffer object written **ANDREW**
    - receive audio into buffer and output files (D1)
    - convert and analyze with full suite of features **ADOM**
    - parse and join back with tag
    - enter into master database
  - How the NN needs to be different for our implementation **GROUP/ANDREW**
  - Verify schedule and touch base, assess MVPs **decide Day 3/4 roles**
  - Django setup **ADOM**

### Day 3

 - automating dataset population to n-songs  **TBD**
 - first opportunity to train it/hopefully give it a song **TBD**
 - Django to receive a call, make a call, buffer the object **TBD**


### Day 4
  - Frontend index file with webpack, ajax calls in JS, some buttons **TBD**
  - Django need to correctly take in and return result **TBD**
  - Get heroku set up **TBD**

### Day 5
  - messing with the model or exploring the model
  - Frontend probabilities display component
  - Frontend spotify search
    + search requests
    + autosuggest population
    + send id to backend
    + backend request stream
    + backend runs feature Extraction
    + backend runs NN
    + return result to front end
  - Frontend 'working' animation/when they're waiting

### Day 6
 - About the project copy
 - improve UX
