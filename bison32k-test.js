const aiplatform = require('@google-cloud/aiplatform');
const dotenv = require('dotenv');

dotenv.config()

// The project and location where the model is deployed
const project = process.env.PROJECT_ID || 'YOUR_PROJECT_ID';
const location = process.env.LOCATION || 'us-central1';

// Imports the Google Cloud Prediction service client
const {PredictionServiceClient} = aiplatform.v1;

// Import the helper module for converting arbitrary protobuf.Value objects.
const {helpers} = aiplatform;

// Specifies the location of the api endpoint
const clientOptions = {
  apiEndpoint: 'us-central1-aiplatform.googleapis.com',
};

const publisher = 'google';
const model = 'text-bison-32k';

// Instantiates a client
const predictionServiceClient = new PredictionServiceClient(clientOptions);

async function callPredict() {
  // Configure the parent resource
  const endpoint = `projects/${project}/locations/${location}/publishers/${publisher}/models/${model}`;

  const prompt = {
    prompt:
      'Give me ten interview questions for the role of program manager.',
  };
  const instanceValue = helpers.toValue(prompt);
  const instances = [instanceValue];

  const parameter = {
    temperature: 0.2,
    maxOutputTokens: 256,
    topP: 0.95,
    topK: 40,
  };
  const parameters = helpers.toValue(parameter);

  const request = {
    endpoint,
    instances,
    parameters,
  };

  // Predict request
  const response = await predictionServiceClient.predict(request);
  console.log('Get text prompt response');
  console.log((JSON.stringify(response[0]["predictions"][0],null,1)));
}

callPredict();