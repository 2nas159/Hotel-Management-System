import React from "react";
import Title from "../ui/Title";
import { testimonials } from "../../assets/assets";
import StarRating from "../ui/StarRating";

const Testimonial = () => {
  return (
    <div className="py-16 md:py-24 px-6 md:px-16 lg:px-24">
      <Title title="Testimonials" subTitle="What our customers say about us" />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-12 md:mt-16 max-w-7xl mx-auto">
        {testimonials.map((testimonial) => (
          <div
            key={testimonial.id}
            className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
          >
            <div className="flex items-center gap-4">
              <img
                className="w-14 h-14 rounded-full object-cover border-2 border-slate-50"
                src={testimonial.image}
                alt={testimonial.name}
              />
              <div>
                <p className="font-playfair text-xl font-semibold text-slate-800">
                  {testimonial.name}
                </p>
                <p className="text-gray-400 text-sm">{testimonial.address}</p>
              </div>
            </div>
            <div className="flex items-center gap-1 mt-6 text-yellow-400">
              <StarRating />
            </div>
            <p className="text-gray-600 mt-4 italic leading-relaxed">
              "{testimonial.review}"
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Testimonial;
