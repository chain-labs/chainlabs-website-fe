"use client";

import AutoScroll from "embla-carousel-auto-scroll";
import { ChevronRight } from "lucide-react";
import { useRef } from "react";

import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { Card } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";

const testimonials = [
  {
    name: "Sarah Chen",
    role: "CTO at TechFlow",
    avatar: "https://api.dicebear.com/9.x/adventurer/svg?seed=Sarah%20Chen",
    content:
      "Chain Labs transformed our customer service with their AI chatbot. Response times dropped by 80% and customer satisfaction soared.",
  },
  {
    name: "Marcus Rodriguez",
    role: "Operations Director at RetailPro",
    avatar:
      "https://api.dicebear.com/9.x/adventurer/svg?seed=Marcus%20Rodriguez",
    content:
      "Their predictive analytics solution helped us forecast demand 3x more accurately. Game-changing for our supply chain.",
  },
  {
    name: "Jennifer Kim",
    role: "Marketing VP at GrowthCorp",
    avatar: "https://api.dicebear.com/9.x/adventurer/svg?seed=Jennifer%20Kim",
    content:
      "The personalization engine they built increased our conversion rates by 250%. ROI was immediate and substantial.",
  },
  {
    name: "David Park",
    role: "CEO at InnovateTech",
    avatar: "https://api.dicebear.com/9.x/adventurer/svg?seed=David%20Park",
    content:
      "Chain Labs doesn\'t just deliver AI solutions - they deliver business transformation. Highly recommended.",
  },
];

const ScrollingCarouselTestimonials = () => {
  const plugin = useRef(
    AutoScroll({
      startDelay: 500,
      speed: 0.7,
    })
  );

  return (
    <section className="py-32">
      <div className="container flex flex-col items-center gap-4">
        <h2 className="text-center text-3xl font-semibold lg:text-4xl">
          What Our Clients Say
        </h2>
        <a href="#" className="flex items-center gap-1 font-semibold">
          View All Success Stories
          <ChevronRight className="mt-0.5 h-4 w-auto" />
        </a>
      </div>
      <div className="lg:container">
        <div className="mt-16 space-y-4">
          <Carousel
            opts={{
              loop: true,
            }}
            plugins={[plugin.current]}
            onMouseLeave={() => plugin.current.play()}
            className="relative before:absolute before:top-0 before:bottom-0 before:left-0 before:z-10 before:w-36 before:bg-linear-to-r before:from-background before:to-transparent after:absolute after:top-0 after:right-0 after:bottom-0 after:z-10 after:w-36 after:bg-linear-to-l after:from-background after:to-transparent"
          >
            <CarouselContent>
              {testimonials.map((testimonial, index) => (
                <CarouselItem key={index} className="basis-auto">
                  <Card className="max-w-96 p-6 select-none">
                    <div className="mb-4 flex gap-4">
                      <Avatar className="size-14 rounded-full ring-1 ring-input">
                        <AvatarImage
                          src={testimonial.avatar}
                          alt={testimonial.name}
                        />
                      </Avatar>
                      <div>
                        <p className="font-medium">{testimonial.name}</p>
                        <p className="text-sm text-muted-foreground">
                          {testimonial.role}
                        </p>
                      </div>
                    </div>
                    <q className="leading-7 text-muted-foreground">
                      {testimonial.content}
                    </q>
                  </Card>
                </CarouselItem>
              ))}
            </CarouselContent>
          </Carousel>
        </div>
      </div>
    </section>
  );
};

export { ScrollingCarouselTestimonials };