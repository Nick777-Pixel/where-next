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
  const [workoutLevel, setWorkoutLevel] = useState("beginner");
  const [workoutDuration, setWorkoutDuration] = useState("");

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
    const workoutPlan = `Workout Plan:
      Level: ${workoutLevel}
      Duration: ${workoutDuration}
      // Add more details based on your requirements

      // Example workout plan based on level and duration
      Monday: Cardio exercises for warm-up, followed by boxing drills and technique practice.
      Tuesday: Strength training exercises focusing on core and upper body.
      Wednesday: Rest day.
      Thursday: High-intensity interval training (HIIT) with boxing combinations.
      Friday: Footwork drills and speed bag training.
      Saturday: Full-body workout combining boxing and circuit training.
      Sunday: Rest day.
    `;

    // Display the workout plan
    console.log(workoutPlan);
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
              <Select
                onChange={setSelectedCountryNames}
                isDisabled={isLoading}
              />
              <label className="block mt-4">
                Workout Level:
                <select
                  value={workoutLevel}
                  onChange={(e) => setWorkoutLevel(e.target.value)}
                  className="block mt-1"
                >
                  <option value="beginner">Beginner</option>
                  <option value="intermediate">Intermediate</option>
                  <option value="advanced">Advanced</option>
                </select>
              </label>
              <label className="block mt-4">
                Workout Duration (minutes):
                <input
                  type="text"
                  value={workoutDuration}
                  onChange={(e) => setWorkoutDuration(e.target.value)}
                  className="block mt-1"
                />
              </label>
              <button
                onClick={handleFind}
                className="button--primary flex justify-center"
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
      </main>
      <Footer />
    </div>
  );
}
