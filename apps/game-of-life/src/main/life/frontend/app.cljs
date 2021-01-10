(ns life.frontend.app)

(defn init []
  (let [board #{{:x 3 :y 4}}]
    (println (contains? board {:x 3 :y 4}))
    (println (contains? board {:x 3 :y 5}))
    (println (conj board {:x 3 :y 4}))
    (println (conj board {:x 3 :y 5}))))
