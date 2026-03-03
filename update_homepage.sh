#!/bin/bash
sed -i '' 's/import Button from/import Loader from "..\/components\/Loader";\
import Button from/g' frontend/pages/HomePage.tsx

sed -i '' 's/const HomePage = () => {/const HomePage = () => {\
  const \[isLoading, setIsLoading\] = useState(true);/g' frontend/pages/HomePage.tsx

sed -i '' 's/return (/if (isLoading) return <Loader \/>;\n\n  return (/g' frontend/pages/HomePage.tsx
