import { useState } from "react";
import { isEmpty } from "lodash";
import { useMutation } from "react-query";
import { AnimatePresence } from "framer-motion";

import Head from "next/head";
import Header from "@/components/header";
import Banner from "@/components/banner";
import Select from "@/components/select";
import Loader from "@/components/loader";
import MetaTags from "@/components/meta-tags";
import Toast, { toast } from "@/components/toast";
import Footer from "@/components/footer";
import AnimatedSection from "@/components/animated-section";

import { getCountriesByCode } from "@/utils/lookup";
import { fetchSuggestions } from "@/utils/api";
import { ERR_MESSAGE_NOT_FOUND } from "@/utils/constants";

export default function HomePage() {
  const [selectedCountryNames, setSelectedCountryNames] = useState([]);
  const [workoutLevel, setWorkoutLevel] = useState("beginner"); // New state for workout level
  const [workoutDuration, setWorkoutDuration] = useState(""); // New state for workout duration

  const {
    isLoading,
    mutate: generateSuggestions,
    data: suggestions,
    reset,
  } = useMutation(() => fetchSuggestions(selectedCountryNames), {
    onError: () => {
      toast(ERR_MESSAGE_NOT_FOUND);
    },
  });

  function handleFind() {
    if (isEmpty(selectedCountryNames)) {
      return toast("Please select at least one country");
    }
    
    // Generate workout plan based on dropdown value and text input
    const workoutPlan = generateWorkoutPlan(workoutLevel, workoutDuration);
    console.log(workoutPlan);
    
    generateSuggestions();
  }

  function handleReset() {
    reset();
    setSelectedCountryNames([]);
  }

  // Function to generate workout plan based on dropdown value and text input
  function generateWorkoutPlan(level, duration) {
    let plan = "";
    switch (level) {
      case "beginner":
        plan = `Beginner Workout Plan for ${duration} minutes:\n- Warm up with light stretches\n- Shadow boxing for 5 minutes\n- Jump rope for 10 minutes\n- Jab-cross combinations for 5 minutes\n- Basic footwork drills for 5 minutes\n- Cool down with stretching exercises`;
        break;
      case "intermediate":
        plan = `Intermediate Workout Plan for ${duration} minutes:\n- Warm up with dynamic stretches\n- Shadow boxing for 10 minutes\n- Heavy bag work for 15 minutes\n- Speed bag drills for 10 minutes\n- Defensive drills for 10 minutes\n- Cool down with stretching exercises`;
        break;
      case "advanced":
        plan = `Advanced Workout Plan for ${duration} minutes:\n- Warm up with cardio exercises\n- Shadow boxing for 15 minutes\n- Combination drills on heavy bag for 20 minutes\n- Sparring or focus mitt drills for 15 minutes\n- Advanced footwork drills for 10 minutes\n- Cool down with stretching exercises`;
        break;
      default:
        plan = "Invalid workout level";
        break;
    }
    return plan;
  }

  return (
    <div className="py-4">
      <Head>
        <title>Where to go Next?</title>
        <MetaTags />
      </Head>

      <Toast />
      <Header />
      <Banner />

      <main className="p-4 max-w-xl mx-auto -mt-14">
        <AnimatePresence mode="popLayout">
          {isEmpty(suggestions) && (
            <AnimatedSection>
              <h2 className="font-bold text-xl mb-3 text-white">
                Where have you already been?
              </h2>
              <Select onChange={setSelectedCountryNames} isDisabled={isLoading} />

              <div className="mt-4">
                <label htmlFor="workoutLevel" className="font-bold text-white">
                  Workout Level:
                </label>
                <select
                  id="workoutLevel"
                  className="block w-full p-2 mt-1 rounded-md bg-white text-gray-800"
                  value={workoutLevel}
                  onChange={(e) => setWorkoutLevel(e.target.value)}
                >
                  <option value="beginner">Beginner</option>
                  <option value="intermediate">Intermediate</option>
                  <option value="advanced">Advanced</option>
                </select>
              </div>

              <div className="mt-4">
                <label htmlFor="workoutDuration" className="font-bold text-white">
                  Workout Duration (in minutes):
                </label>
                <input
                  type="text"
                  id="workoutDuration"
                  className="block w-full p-2 mt-1 rounded-md bg-white text-gray-800"
                  value={workoutDuration}
                  onChange={(e) => setWorkoutDuration(e.target.value)}
                />
              </div>

              <button
                onClick={handleFind}
                className="button--primary flex justify-center mt-4"
                disabled={isLoading}
              >
                {isLoading ? (
                  <span className="flex justify-center gap-1">
                    Finding Destinations <Loader />
                  </span>
                ) : (
                  "Find Destinations"
                )}
              </button>
            </AnimatedSection>
          )}
        </AnimatePresence>

        <AnimatePresence mode="popLayout">
          {!isEmpty(suggestions) && (
            <AnimatedSection>
              <h2 className="font-bold text-xl mb-3 text-white">
                Our top destinations for you are the following, have fun!
              </h2>
              <div>
                {getCountriesByCode(suggestions).map((suggestion, index) => {
                  if (!suggestion) return null;
                  return (
                    <div
                      key={index}
                      className="bg-neutral-900 text-neutral-300 px-3 py-2 rounded-md my-3"
                    >
                      <span>{`${suggestion.emoji} ${suggestion.name}`}</span>
                      <a
                        className="block mt-1 text-neutral-500"
                        target="_blank"
                        href={suggestion.url}
                        rel="noreferrer"
                      >
                        Read more on Wikipedia &rarr;
                      </a>
                    </div>
                  );
                })}
              </div>
              <button onClick={handleReset} className="button--primary">
                Find again
              </button>
            </AnimatedSection>
          )}
        </AnimatePresence>
      </main>
      <Footer />
    </div>
  );
}
