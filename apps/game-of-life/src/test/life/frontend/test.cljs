(ns life.frontend.test
  (:require [cljs.test :refer (deftest is run-tests)]))

(deftest a-failing-test
  (is (= 1 2)))

(defn init []
  (run-tests))

