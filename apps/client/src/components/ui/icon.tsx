import { lazy, memo, Suspense } from "react";
import { LucideProps } from "lucide-react";
import dynamicIconImports from "lucide-react/dynamicIconImports";

const fallback = <></>;

interface IconProps extends Omit<LucideProps, "ref"> {
  name: keyof typeof dynamicIconImports;
}

const Icon = ({ name, ...props }: IconProps) => {
  const LucideIcon = lazy(dynamicIconImports[name]);

  return (
    <Suspense fallback={fallback}>
      <LucideIcon {...props} />
    </Suspense>
  );
};

export default memo(Icon);
