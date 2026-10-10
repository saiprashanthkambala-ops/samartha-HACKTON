import { PageContainer } from '../components/layout/Page.jsx';
import HomeHero, { QUICK_LINKS } from '../components/home/HomeHero.jsx';
import QuickAccessCard from '../components/home/QuickAccessCard.jsx';
import ExploreCrops from '../components/home/ExploreCrops.jsx';

export default function HomePage() {
  return (
    <PageContainer>
      <HomeHero />
      <div className="quick-row">
        {QUICK_LINKS.map((q) => (
          <QuickAccessCard key={q.to + q.titleKey} {...q} />
        ))}
      </div>
      <ExploreCrops />
    </PageContainer>
  );
}
