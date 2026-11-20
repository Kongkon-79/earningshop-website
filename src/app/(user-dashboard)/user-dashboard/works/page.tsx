import WorksContainer from "./_components/works-container";

type PageParam = string | string[] | undefined;

function readPage(value: PageParam) {
  return typeof value === "string" && /^\d{1,6}$/.test(value) ? Math.max(1, Number(value)) : 1;
}

export default function WorksPage({ searchParams }: { searchParams?: { tasksPage?: PageParam; submissionsPage?: PageParam } }) {
  return (
    <WorksContainer
      tasksPage={readPage(searchParams?.tasksPage)}
      submissionsPage={readPage(searchParams?.submissionsPage)}
    />
  );
}
