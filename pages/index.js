import Head from 'next/head';
import { useEffect } from 'react';

/* ─── Data ─────────────────────────────── */
const projects = [
  {
    id: '01',
    name: 'Adpex (In Active development)',
    url: 'web-production-5017.up.railway.app',
    desc: 'AI-powered marketing intelligence SaaS. Autonomous LangGraph pipeline analyzes Google Ads + Meta Ads data, detects anomalies, and delivers weekly reports with prioritized recommendations.',
    tags: ['Next.js', 'LangGraph', 'Tailwind CSS', 'AI', 'Claude', 'Postgres'],
  },
  {
    id: '02',
    name: 'FreightPulse',
    // url: 'https://auditjobs.xyz',
    desc: 'AI-powered daily owner digest for a freight forwarding business. Built it for my cousin who owns a freight forwarding business',
    tags: ['AI', 'gpt-5', 'Next.js'],
  },
  {
    id: '02',
    name: 'AuditJobs',
    url: 'https://auditjobs.vercel.app',
    desc: 'Curated job board for blockchain security engineers and smart contract auditors. The go-to resource for web3 security roles.',
    tags: ['React', 'Tailwind CSS'],
  },
  {
    id: '02',
    name: 'AqarMetrics',
    url: 'https://aqarmetrics.com',
    desc: 'Top Dubai real estate projects ranked by sales volume and demand score to help investors identify high-potential opportunities.',
    tags: ['React', 'Tailwind CSS'],
  },
  {
    id: '03',
    name: 'SwitchBoardAI',
    // url: 'https://auditjobs.xyz',
    desc: 'a multi-agent coordination platform on top of OpenClaw with a React dashboard, staggered heartbeat scheduling, per-agent persistent memory, a shared task board, and automatic session transcript ingestion.',
    tags: ['OpenClaw', 'Next.js' , 'Claude', 'AI'],
  },
  
];

const skillGroups = [
  {
    title: 'Frontend',
    skills: ['React', 'Next.js', 'TypeScript', 'JavaScript (ES2022+)', 'Tailwind CSS', 'CSS / SCSS'],
  },
  {
    title: 'Animation & UX',
    skills: ['Framer Motion', 'CSS Animations'],
  },
  {
    title: 'Backend & Web3',
    skills: ['Node.js', 'REST APIs', 'Solidity', 'Ethers.js', 'Web3.js', 'PostgreSQL'],
  },
];

/* ─── Page ─────────────────────────────── */
export default function Home() {
  useEffect(() => {
    const els = document.querySelectorAll('[data-reveal]');
    const obs = new IntersectionObserver(
      (entries) =>
        entries.forEach((e) => {
          if (e.isIntersecting) e.target.classList.add('revealed');
        }),
      { threshold: 0.08, rootMargin: '0px 0px -40px 0px' }
    );
    els.forEach((el) => obs.observe(el));
    return () => obs.disconnect();
  }, []);

  return (
    <>
      <Head>
        <title>Aashar Ck — Frontend Developer</title>
        <meta
          name="description"
          content="Frontend developer specialising in React, Next.js and TypeScript. Building fast, modern, and visually compelling web experiences."
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon-aashar.png" />
      </Head>

      {/* ── NAV ───────────────────────────── */}
      <nav className="nav">
        <a href="#" className="nav-logo">ACK</a>
        <div className="nav-links">
          <a
            href="https://github.com/aasharck"
            target="_blank"
            rel="noopener noreferrer"
            className="nav-link"
          >
            GitHub
          </a>
          <a
            href="https://docs.google.com/document/d/1VO5yCeXHK34XBkvh7ptOTtqm0gqJtRfRESjZh9nvwEU/edit?usp=sharing"
            target="_blank"
            rel="noopener noreferrer"
            className="nav-link"
          >
            Résumé
          </a>
          <a href="mailto:aasharck7357@gmail.com" className="nav-cta">
            Get in touch
          </a>
        </div>
      </nav>

      {/* ── HERO ──────────────────────────── */}
      <section className="hero">
        <p className="hero-eyebrow">Frontend Developer — Open to roles</p>

        <h1 className="hero-name">
          <span className="hero-name-line">Aashar</span>
          <span className="hero-name-line">Ck</span>
        </h1>

        <div className="hero-bottom">
          <p className="hero-role">
            Building fast, modern &amp; visually compelling<br />
            web experiences with <em>React &amp; Next.js.</em>
          </p>
          <div className="hero-scroll">
            <span className="hero-scroll-line" />
            <span>scroll</span>
          </div>
        </div>
      </section>

      <div className="divider" />

      {/* ── ABOUT ─────────────────────────── */}
      <section className="section" id="about">
        <div className="section-header" data-reveal>
          <span className="section-num">01</span>
          <span className="section-label">About</span>
          <span className="section-rule" />
        </div>

        <div className="about-grid">
          {/* Left: bio */}
          <div data-reveal>
            <h2 className="about-headline">
              I build interfaces that feel <em>alive.</em>
            </h2>

            <p className="about-para">
              I’m a frontend-focused developer who cares a lot about how things feel — not just how they look.
              Smooth animations, meaningful transitions, and small details that make an interface enjoyable to use.
            </p>

            <p className="about-para">
              I mainly work with React and Next.js, building fast and clean user experiences.
              I also have a background in Web3 and smart contracts, so I’m comfortable working across the stack —
              from UI to integrations and real-time data.
            </p>

            <p className="about-para">
              I’ve built a few products on my own, from SaaS tools to blockchain apps,
              and I’ve done smart contract audits for DeFi protocols through Code4rena and Sherlock.
            </p>
            {/* Stats */}
            <div className="about-stats">
              <div>
                <div className="stat-value">5+</div>
                <div className="stat-label">Products shipped</div>
              </div>
              <div>
                <div className="stat-value">5+</div>
                <div className="stat-label">Years building</div>
              </div>
            </div>
          </div>

          {/* Right: skills */}
          <div className="skills-block" data-reveal data-delay="2">
            <div className="skills-section-label">Stack</div>
            {skillGroups.map((group) => (
              <div key={group.title} className="skills-group">
                <div className="skills-group-title">{group.title}</div>
                <div className="skills-tags">
                  {group.skills.map((s) => (
                    <span key={s} className="skill-pill">{s}</span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className="divider" />

      {/* ── WORK ──────────────────────────── */}
      <section className="section" id="work">
        <div className="section-header" data-reveal>
          <span className="section-num">02</span>
          <span className="section-label">Selected Work</span>
          <span className="section-rule" />
        </div>

        <div className="projects-list">
          {projects.map((p, i) => (
            <a
              key={p.id}
              href={p.url}
              target="_blank"
              rel="noopener noreferrer"
              className="project-row"
              data-reveal
              style={{ transitionDelay: `${i * 0.06}s` }}
            >
              <span className="project-num">{p.id}</span>
              <div>
                <div className="project-name">{p.name}</div>
                <div className="project-desc">{p.desc}</div>
              </div>
              <div className="project-tags-wrap">
                {p.tags.map((t) => (
                  <span key={t} className="project-tag">{t}</span>
                ))}
              </div>
              <span className="project-arrow">↗</span>
            </a>
          ))}
        </div>
      </section>

      <div className="divider" />

      {/* ── CONTACT ───────────────────────── */}
      <section className="section" id="contact">
        <div className="section-header" data-reveal>
          <span className="section-num">03</span>
          <span className="section-label">Contact</span>
          <span className="section-rule" />
        </div>

        <div className="contact-grid">
          {/* Left: CTA */}
          <div data-reveal>
            <h2 className="contact-headline">
              Let&apos;s build<br />
              something <span>great.</span>
            </h2>
            <p className="contact-sub">
              I&apos;m actively looking for frontend roles where I can work on
              ambitious, well-crafted products. If that&apos;s you — let&apos;s talk.
            </p>
          </div>

          {/* Right: links */}
          <div className="contact-links" data-reveal data-delay="2">
            <a href="mailto:aasharck7357@gmail.com" className="contact-link">
              <div className="contact-link-label">
                <span className="contact-link-type">Email</span>
                <span>aasharck@gmail.com</span>
              </div>
              <span className="link-arrow">↗</span>
            </a>
            <a
              href="https://github.com/aasharck"
              target="_blank"
              rel="noopener noreferrer"
              className="contact-link"
            >
              <div className="contact-link-label">
                <span className="contact-link-type">GitHub</span>
                <span>github.com/aasharck</span>
              </div>
              <span className="link-arrow">↗</span>
            </a>
            <a
              href="https://cal.com/aashar"
              target="_blank"
              rel="noopener noreferrer"
              className="contact-link"
            >
              <div className="contact-link-label">
                <span className="contact-link-type">Schedule</span>
                <span>Book a call — cal.com/aashar</span>
              </div>
              <span className="link-arrow">↗</span>
            </a>
            <a
              href="https://docs.google.com/document/d/1iGR1EBz8SLm0-iLMEGrRu3NvrWq-YzhaZ9cbDyoNOgw/edit?usp=sharing"
              target="_blank"
              rel="noopener noreferrer"
              className="contact-link"
            >
              <div className="contact-link-label">
                <span className="contact-link-type">Document</span>
                <span>View Résumé</span>
              </div>
              <span className="link-arrow">↗</span>
            </a>
          </div>
        </div>

        <footer className="footer">
          <span>© 2026 Aashar Ck</span>
          <span>Frontend Developer — React · Next.js · TypeScript</span>
        </footer>
      </section>
    </>
  );
}
