import ButtonCTA from "@/components/ButtonCTA";

const ActionBox = () => (
  <section
    className="py-20"
    data-aos="fade-up"
    data-aos-easing="ease"
    data-aos-duration={1000}
  >
    <div className="container">
      <div className="max-w-xl mx-auto text-center">
        <h2 className="text-3xl font-medium capitalize text-white mb-4">
          Book Your Free AI Consultation Today
        </h2>
        <p className="text-sm text-default-200 font-medium">
          Discover how Helping Hand AI Solutions can streamline your processes, reduce headaches,
          and unlock growth. Let's talk about your goals and build the future together.
        </p>
        <div className="mt-8">
          <ButtonCTA />
        </div>
      </div>
    </div>
  </section>
);

export default ActionBox;
