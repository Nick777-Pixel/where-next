import { useState } from "react";
import { isEmpty } from "lodash";
import { useMutation } from "react-query";
import { lookup } from "@/utils/lookup";
import { motion, AnimatePresence } from "framer-motion";
import { generateSuggestions } from "@/utils/api";

import Head from "next/head";
import Header from "@/components/header";
import Select from "@/components/select";
import Toast, { toast } from "@/components/toast";

export default function HomePage() {
  const [selected, setSelected] = useState([]);
  const {
    isLoading,
    mutate: generate,
    data: suggestions,
    reset,
  } = useMutation(() => generateSuggestions(selected));

  function handleFind() {
    if (isEmpty(selected)) {
      return toast("Please select atleast one country");
    }
    generate();
  }

  return (
    <div className='py-10'>
      <Head>
        <title>Where to go Next?</title>
      </Head>

      <Toast />

      <Header />
      <main className='p-4 max-w-xl mx-auto -mt-14'>
        <AnimatePresence>
          {!isLoading && isEmpty(suggestions) && (
            <motion.section
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className='mt-10'
            >
              <h2 className='font-bold text-xl mb-3 text-white'>
                Where have you already been?
              </h2>
              <Select onChange={setSelected} />
              <button onClick={handleFind} className='button--primary'>
                {isLoading ? "Loading..." : "Find Destinations"}
              </button>

              <p className='text-center mt-3 text-neutral-500'>
                OpenAI will find the best next countries based on your
                selections.
              </p>
            </motion.section>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {!isLoading && !isEmpty(suggestions) && (
            <motion.section
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className='mt-10'
            >
              <h2 className='font-bold text-xl mb-3 text-white'>
                Our top destinations for you are the following, have fun!
              </h2>
              <div>
                {lookup(suggestions).map((suggestion, index) => {
                  if (!suggestion) return null;
                  return (
                    <div
                      key={index}
                      className='bg-neutral-900 text-neutral-300 px-3 py-2 rounded-md my-3'
                    >
                      <span>{`${suggestion.emoji} ${suggestion.name}`}</span>
                      <a
                        className='block mt-1 text-neutral-500'
                        target='_blank'
                        href={suggestion.url}
                        rel='noreferrer'
                      >
                        Ready more on Wikipedia &rarr;
                      </a>
                    </div>
                  );
                })}
              </div>
              <button onClick={reset} className='button--primary'>
                Find again
              </button>
            </motion.section>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}
