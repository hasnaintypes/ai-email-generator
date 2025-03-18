const Loader = () => {
  return (
    <div className="flex justify-center items-center h-full">
      <div className="relative w-24 h-24 rotate-45">
        {Array.from({ length: 7 }).map((_, index) => (
          <div
            key={index}
            className="absolute w-7 h-7 bg-white animate-square"
            style={{ animationDelay: `-${index * 1.428}s` }}
          />
        ))}
      </div>
    </div>
  );
};

export default Loader;
