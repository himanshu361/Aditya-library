import { useEffect, useState } from 'react'
import { Link, Route, Routes, useLocation, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import SecureNotesApp from './SecureNotesApp'
import SecureReader from './SecureReader'

const classList = [9, 10, 11, 12]

const classDetails = {
  9: {
    title: 'Class 9',
    subjects: ['Physics', 'Chemistry', 'Mathematics', 'English'],
    description: 'Build the base for strong concept clarity and steady academic preparation.',
  },
  10: {
    title: 'Class 10',
    subjects: ['Physics', 'Chemistry', 'Mathematics', 'English'],
    description: 'Practice core board concepts with structured chapter-wise support and revision.',
  },
  11: {
    title: 'Class 11',
    subjects: ['Physics', 'Chemistry', 'Mathematics', 'English'],
    description: 'Strengthen analytical thinking with high-value science and math chapters.',
  },
  12: {
    title: 'Class 12',
    subjects: ['Physics', 'Chemistry', 'Mathematics', 'English'],
    description: 'Prepare for board excellence with premium chapter access and exam-focused notes.',
  },
} as const

const notesData: Record<number, Record<string, { number: number; title: string; description: string; price: number }[]>> = {
  9: {
    Physics: [
      { number: 1, title: 'Basic Physical Quantities and Measurement', description: 'Units, measurements and basic physical quantities.', price: 269 },
      { number: 2, title: 'Motion', description: 'Basics of motion, displacement, velocity and acceleration.', price: 269 },
      { number: 3, title: 'Force and Laws of Motion', description: 'Newton’s laws with numerical examples and conceptual notes.', price: 269 },
      { number: 4, title: 'Gravitation', description: 'Gravity, free fall and universal law of gravitation.', price: 269 },
      { number: 5, title: 'Work and Energy', description: 'Energy, power, work and conservation principles.', price: 269 },
      { number: 6, title: 'Sound', description: 'Wave motion, sound production, propagation and characteristics.', price: 269 },
    ],
    Chemistry: [
      { number: 1, title: 'Matter and Its Nature', description: 'States of matter and physical properties.', price: 269 },
      { number: 2, title: 'Is Matter Around Us Pure?', description: 'Elements, compounds, mixtures and separation techniques.', price: 269 },
      { number: 3, title: 'Atoms and Molecules', description: 'Atomic theory, laws of chemical combination and molecules.', price: 269 },
      { number: 4, title: 'Structure of the Atom', description: 'Atomic models, subatomic particles and electronic structure.', price: 269 },
      { number: 5, title: 'Chemical Changes and Reactions', description: 'Recognise and explain common chemical changes and reactions.', price: 269 },
      { number: 6, title: 'Elements and Compounds', description: 'Classify substances and compare elements with compounds.', price: 269 },
      { number: 7, title: 'Basic Chemical Calculations', description: 'Apply introductory calculations to chemical quantities.', price: 269 },
    ],
    Mathematics: [
      { number: 1, title: 'Number Systems', description: 'Real numbers, irrational numbers and decimal expansion.', price: 269 },
      { number: 2, title: 'Polynomials', description: 'Algebraic expressions, identities and factorisation.', price: 269 },
      { number: 3, title: 'Coordinate Geometry', description: 'Cartesian plane, plotting and distance formulas.', price: 269 },
      { number: 4, title: 'Linear Equations in Two Variables', description: 'Pair of linear equations and their graphical solutions.', price: 269 },
      { number: 5, title: "Introduction to Euclid's Geometry", description: 'Euclid’s postulates and geometry basics.', price: 269 },
      { number: 6, title: 'Lines and Angles', description: 'Angles, parallel lines and angle relationships.', price: 269 },
      { number: 7, title: 'Triangles', description: 'Properties of triangles and congruence.', price: 269 },
      { number: 8, title: 'Quadrilaterals', description: 'Types of quadrilaterals and their properties.', price: 269 },
      { number: 9, title: 'Circles', description: 'Circle theorems and related geometry.', price: 269 },
      { number: 10, title: "Heron's Formula", description: 'Area calculation for triangles using Heron’s formula.', price: 269 },
      { number: 11, title: 'Surface Areas and Volumes', description: 'Surface area and volume of solids.', price: 269 },
      { number: 12, title: 'Statistics', description: 'Mean, median, mode and data interpretation.', price: 269 },
      { number: 13, title: 'Probability', description: 'Basic probability and event analysis.', price: 269 },
      { number: 14, title: 'Mathematical Reasoning, Modelling and Applications', description: 'Use mathematical reasoning and models in everyday applications.', price: 269 },
    ],
    'English - Beehive - Prose': [
      { number: 1, title: 'The Fun They Had', description: 'A story about futuristic schooling and imagination.', price: 269 },
      { number: 2, title: 'The Sound of Music', description: 'Inspirational stories of musical talent and perseverance.', price: 269 },
      { number: 3, title: 'The Little Girl', description: 'A story about love, discipline and growing up.', price: 269 },
      { number: 4, title: 'A Truly Beautiful Mind', description: 'Life and contributions of Albert Einstein.', price: 269 },
      { number: 5, title: 'The Snake and the Mirror', description: 'Humour and suspense in a reflective narrative.', price: 269 },
      { number: 6, title: 'My Childhood', description: 'A reflective memoir on family and ideals.', price: 269 },
      { number: 7, title: 'Reach for the Top', description: 'Inspiration from achievers and self-belief.', price: 269 },
      { number: 8, title: 'Kathmandu', description: 'Travel experience and poetic appreciation of culture.', price: 269 },
      { number: 9, title: 'If I Were You', description: 'A humorous play with clever twists and wit.', price: 269 },
    ],
    'English - Beehive - Poems': [
      { number: 1, title: 'The Road Not Taken', description: 'Theme of choice, uncertainty and individuality.', price: 269 },
      { number: 2, title: 'Wind', description: 'Poem focused on the power of nature and resilience.', price: 269 },
      { number: 3, title: 'Rain on the Roof', description: 'Sensory imagery and emotional warmth.', price: 269 },
      { number: 4, title: 'The Lake Isle of Innisfree', description: 'Longing for peace and nature.', price: 269 },
      { number: 5, title: 'A Legend of the Northland', description: 'Mythological poem with moral insight.', price: 269 },
      { number: 6, title: 'No Men Are Foreign', description: 'Message of universal humanity and equality.', price: 269 },
      { number: 7, title: 'The Duck and the Kangaroo', description: 'A whimsical story in poetic form.', price: 269 },
      { number: 8, title: 'On Killing a Tree', description: 'A reflection on the destruction of nature.', price: 269 },
      { number: 9, title: 'The Snake Trying', description: 'Poetry on survival, struggle and nature.', price: 269 },
      { number: 10, title: 'A Slumber Did My Spirit Seal', description: 'Dream, imagination and poetic introspection.', price: 269 },
    ],
    'English - Moments': [
      { number: 1, title: 'The Lost Child', description: 'A story of separation, fear and parental love.', price: 269 },
      { number: 2, title: 'The Adventures of Toto', description: 'Humorous tale about a naughty monkey.', price: 269 },
      { number: 3, title: 'Iswaran the Storyteller', description: 'A colourful narration style and village life.', price: 269 },
      { number: 4, title: 'In the Kingdom of Fools', description: 'Satire and absurdity in a fictional kingdom.', price: 269 },
      { number: 5, title: 'The Happy Prince', description: 'A moral tale of compassion and sacrifice.', price: 269 },
      { number: 6, title: 'Weathering the Storm in Ersama', description: 'Resilience amid disaster and human strength.', price: 269 },
      { number: 7, title: 'The Last Leaf', description: 'Hope, art and friendship in a difficult season.', price: 269 },
      { number: 8, title: 'A House Is Not a Home', description: 'Financial hard times and family struggles.', price: 269 },
      { number: 9, title: 'The Beggar', description: 'A story on dignity and societal perception.', price: 269 },
    ],
    'English - Core Skills': [
      { number: 1, title: 'Reading Comprehension', description: 'Read, understand and interpret unseen texts.', price: 269 },
      { number: 2, title: 'Grammar', description: 'Build accurate grammar for school and examinations.', price: 269 },
      { number: 3, title: 'Writing', description: 'Organise clear and effective written responses.', price: 269 },
      { number: 4, title: 'Literature', description: 'Study themes, characters and literary techniques.', price: 269 },
      { number: 5, title: 'Vocabulary', description: 'Develop word knowledge and contextual usage.', price: 269 },
      { number: 6, title: 'Language Skills', description: 'Strengthen integrated listening, speaking, reading and writing.', price: 269 },
    ],
    'English - Kaveri': [
      { number: 1, title: 'Kaveri Textbook', description: 'Chapter-wise notes and revision for the Kaveri textbook.', price: 269 },
    ],
  },
  10: {
    Physics: [
      { number: 1, title: 'Light – Reflection and Refraction', description: 'Laws of reflection, refraction and lens formula.', price: 269 },
      { number: 2, title: 'The Human Eye and the Colourful World', description: 'Vision defects, scattering and atmospheric optics.', price: 269 },
      { number: 3, title: 'Electricity', description: 'Current, resistance, circuits and power calculations.', price: 269 },
      { number: 4, title: 'Magnetic Effects of Electric Current', description: 'Magnetism, motors and current effects.', price: 269 },
      { number: 5, title: 'Sources of Energy', description: 'Conventional and non-conventional energy resources.', price: 269 },
    ],
    Chemistry: [
      { number: 1, title: 'Chemical Reactions and Equations', description: 'Types of reactions and balancing equations.', price: 269 },
      { number: 2, title: 'Acids, Bases and Salts', description: 'Properties and reactions of acids and bases.', price: 269 },
      { number: 3, title: 'Metals and Non-metals', description: 'Physical and chemical properties with reactivity series.', price: 269 },
      { number: 4, title: 'Carbon and Its Compounds', description: 'Organic chemistry fundamentals and carbon compounds.', price: 269 },
      { number: 5, title: 'Periodic Classification of Elements', description: 'Periodic trends and classification of elements.', price: 269 },
    ],
    Mathematics: [
      { number: 1, title: 'Real Numbers', description: 'Euclid’s division lemma and the fundamental theorem of arithmetic.', price: 269 },
      { number: 2, title: 'Polynomials', description: 'Zeroes of a polynomial and graphical representation.', price: 269 },
      { number: 3, title: 'Pair of Linear Equations in Two Variables', description: 'Solving linear equations graphically and algebraically.', price: 269 },
      { number: 4, title: 'Quadratic Equations', description: 'Solutions and roots of quadratic equations.', price: 269 },
      { number: 5, title: 'Arithmetic Progressions', description: 'Sequences, series and nth terms.', price: 269 },
      { number: 6, title: 'Triangles', description: 'Similarity and proportionality in triangles.', price: 269 },
      { number: 7, title: 'Coordinate Geometry', description: 'Distance formula and section formula.', price: 269 },
      { number: 8, title: 'Introduction to Trigonometry', description: 'Trigonometric ratios and identities.', price: 269 },
      { number: 9, title: 'Some Applications of Trigonometry', description: 'Heights, distances and practical problems.', price: 269 },
      { number: 10, title: 'Circles', description: 'Tangents and properties of circles.', price: 269 },
      { number: 11, title: 'Areas Related to Circles', description: 'Sector and segment area calculations.', price: 269 },
      { number: 12, title: 'Surface Areas and Volumes', description: '3D solids and their calculations.', price: 269 },
      { number: 13, title: 'Statistics', description: 'Measures of central tendency and graph reading.', price: 269 },
      { number: 14, title: 'Probability', description: 'Basic probability and outcomes.', price: 269 },
    ],
    'English - First Flight - Prose': [
      { number: 1, title: 'A Letter to God', description: 'Faith, hope and human nature in a short story.', price: 269 },
      { number: 2, title: 'Nelson Mandela: Long Walk to Freedom', description: 'Leadership, justice and freedom.', price: 269 },
      { number: 3, title: 'Two Stories About Flying', description: 'Courage, fear and self-discovery.', price: 269 },
      { number: 4, title: 'From the Diary of Anne Frank', description: 'Personal reflections and wartime life.', price: 269 },
      { number: 5, title: 'Glimpses of India', description: 'Cultural and regional diversity of India.', price: 269 },
      { number: 6, title: 'Mijbil the Otter', description: 'Humane bond with wildlife and adventure.', price: 269 },
      { number: 7, title: 'Madam Rides the Bus', description: 'A young girl’s first independent journey.', price: 269 },
      { number: 8, title: 'The Sermon at Benares', description: 'Philosophical and spiritual insight.', price: 269 },
      { number: 9, title: 'The Proposal', description: 'Humour and social satire in a play.', price: 269 },
    ],
    'English - First Flight - Poems': [
      { number: 1, title: 'Dust of Snow', description: 'A tiny moment changing a mood.', price: 269 },
      { number: 2, title: 'Fire and Ice', description: 'Symbolism of desire and hatred.', price: 269 },
      { number: 3, title: 'A Tiger in the Zoo', description: 'Contrast between captivity and freedom.', price: 269 },
      { number: 4, title: 'How to Tell Wild Animals', description: 'Humorous poetic descriptions.', price: 269 },
      { number: 5, title: 'The Ball Poem', description: 'Loss, maturity and growing up.', price: 269 },
      { number: 6, title: 'Amanda!', description: 'Imagined freedom and child rebellion.', price: 269 },
      { number: 7, title: 'Animals', description: 'Nature and the emotional tone of living beings.', price: 269 },
      { number: 8, title: 'The Trees', description: 'Nature and human dependence on it.', price: 269 },
      { number: 9, title: 'Fog', description: 'Imagery and mood in a short poem.', price: 269 },
      { number: 10, title: 'The Tale of Custard the Dragon', description: 'Humour, bravery and imagination.', price: 269 },
      { number: 11, title: 'For Anne Gregory', description: 'Beauty, love and personal identity.', price: 269 },
    ],
    'English - Footprints Without Feet': [
      { number: 1, title: 'A Triumph of Surgery', description: 'Humour and social commentary on pet care.', price: 269 },
      { number: 2, title: "The Thief's Story", description: 'Moral transformation and human connection.', price: 269 },
      { number: 3, title: 'The Midnight Visitor', description: 'Spy plot and suspenseful narration.', price: 269 },
      { number: 4, title: 'A Question of Trust', description: 'Character deception and moral complexity.', price: 269 },
      { number: 5, title: 'Footprints Without Feet', description: 'Science fiction and the ethics of power.', price: 269 },
      { number: 6, title: 'The Making of a Scientist', description: 'Curiosity, effort and scientific temper.', price: 269 },
      { number: 7, title: 'The Necklace', description: 'Materialism, irony and consequences.', price: 269 },
      { number: 8, title: 'Bholi', description: 'Empowerment, education and self-worth.', price: 269 },
      { number: 9, title: 'The Book That Saved the Earth', description: 'Humour and imaginative alien comedy.', price: 269 },
    ],
    'English - Core Skills': [
      { number: 1, title: 'Reading Comprehension', description: 'Read, understand and interpret unseen texts.', price: 269 },
      { number: 2, title: 'Grammar', description: 'Build accurate grammar for school and examinations.', price: 269 },
      { number: 3, title: 'Writing', description: 'Organise clear and effective written responses.', price: 269 },
      { number: 4, title: 'Literature', description: 'Study themes, characters and literary techniques.', price: 269 },
      { number: 5, title: 'Vocabulary', description: 'Develop word knowledge and contextual usage.', price: 269 },
      { number: 6, title: 'Language Skills', description: 'Strengthen integrated listening, speaking, reading and writing.', price: 269 },
    ],
    'English - Kaveri': [
      { number: 1, title: 'Kaveri Textbook', description: 'Chapter-wise notes and revision for the Kaveri textbook.', price: 269 },
    ],
  },
  11: {
    Physics: [
      { number: 1, title: 'Units and Measurements', description: 'Units, dimensions and measurement accuracy.', price: 269 },
      { number: 2, title: 'Motion in a Straight Line', description: 'Velocity, acceleration, graphs and equations of motion.', price: 269 },
      { number: 3, title: 'Motion in a Plane', description: 'Vectors, projectile motion and circular motion.', price: 269 },
      { number: 4, title: 'Laws of Motion', description: 'Impulse, inertia, momentum and Newton’s laws.', price: 269 },
      { number: 5, title: 'Work, Energy and Power', description: 'Energy conservation and work calculation.', price: 269 },
      { number: 6, title: 'System of Particles and Rotational Motion', description: 'Torque, rotational dynamics and center of mass.', price: 269 },
      { number: 7, title: 'Gravitation', description: 'Planetary motion, gravitational force and satellites.', price: 269 },
      { number: 8, title: 'Mechanical Properties of Solids', description: 'Elasticity, stress and strain.', price: 269 },
      { number: 9, title: 'Mechanical Properties of Fluids', description: 'Pressure, buoyancy and fluid flow.', price: 269 },
      { number: 10, title: 'Thermal Properties of Matter', description: 'Heat, temperature and thermal expansion.', price: 269 },
      { number: 11, title: 'Thermodynamics', description: 'Heat transfer and laws of thermodynamics.', price: 269 },
      { number: 12, title: 'Kinetic Theory', description: 'Molecular motion and gas laws.', price: 269 },
      { number: 13, title: 'Oscillations', description: 'Simple harmonic motion and wave cycles.', price: 269 },
      { number: 14, title: 'Waves', description: 'Wave characteristics, speed and propagation.', price: 269 },
    ],
    Chemistry: [
      { number: 1, title: 'Some Basic Concepts of Chemistry', description: 'Matter, mole concept and stoichiometry.', price: 269 },
      { number: 2, title: 'Structure of Atom', description: 'Atomic models, orbitals and electron arrangement.', price: 269 },
      { number: 3, title: 'Classification of Elements and Periodicity in Properties', description: 'Periodic trends and group analysis.', price: 269 },
      { number: 4, title: 'Chemical Bonding and Molecular Structure', description: 'VSEPR, hybridisation and bonding principles.', price: 269 },
      { number: 5, title: 'Thermodynamics', description: 'Energy changes and reaction spontaneity.', price: 269 },
      { number: 6, title: 'Equilibrium', description: 'Chemical equilibrium and Le Chatelier principle.', price: 269 },
      { number: 7, title: 'Redox Reactions', description: 'Oxidation-reduction and balancing methods.', price: 269 },
      { number: 8, title: 'Organic Chemistry – Some Basic Principles and Techniques', description: 'Basic organic reactions and mechanisms.', price: 269 },
      { number: 9, title: 'Hydrocarbons', description: 'Alkanes, alkenes and alkynes.', price: 269 },
    ],
    Mathematics: [
      { number: 1, title: 'Sets', description: 'Set operations and Venn diagrams.', price: 269 },
      { number: 2, title: 'Relations and Functions', description: 'Domain, range and types of functions.', price: 269 },
      { number: 3, title: 'Trigonometric Functions', description: 'Angles, identities and graph-based explanation.', price: 269 },
      { number: 4, title: 'Principle of Mathematical Induction', description: 'Proof methods and induction logic.', price: 269 },
      { number: 5, title: 'Complex Numbers and Quadratic Equations', description: 'Complex algebra and roots.', price: 269 },
      { number: 6, title: 'Linear Inequalities', description: 'Solution sets and graphical inequalities.', price: 269 },
      { number: 7, title: 'Permutations and Combinations', description: 'Counting principles and arrangements.', price: 269 },
      { number: 8, title: 'Binomial Theorem', description: 'Expansion and combinatorial coefficients.', price: 269 },
      { number: 9, title: 'Sequences and Series', description: 'AP, GP and general term analysis.', price: 269 },
      { number: 10, title: 'Straight Lines', description: 'Coordinate geometry and line equations.', price: 269 },
      { number: 11, title: 'Conic Sections', description: 'Parabola, ellipse and hyperbola basics.', price: 269 },
      { number: 12, title: 'Introduction to Three-Dimensional Geometry', description: 'Coordinates, distance and direction ratios.', price: 269 },
      { number: 13, title: 'Limits and Derivatives', description: 'Differential calculus basics.', price: 269 },
      { number: 14, title: 'Mathematical Reasoning', description: 'Statements, logic and proof techniques.', price: 269 },
      { number: 15, title: 'Statistics', description: 'Variance, standard deviation and analysis.', price: 269 },
      { number: 16, title: 'Probability', description: 'Conditional probability and Bayes theorem.', price: 269 },
    ],
    'English - Hornbill - Prose': [
      { number: 1, title: 'The Portrait of a Lady', description: 'Family, memory and emotional depth.', price: 269 },
      { number: 2, title: "We're Not Afraid to Die... if We Can All Be Together", description: 'Adventurous survival and courage.', price: 269 },
      { number: 3, title: 'Discovering Tut: The Saga Continues', description: 'Archaeology and historical mystery.', price: 269 },
      { number: 4, title: 'Landscape of the Soul', description: 'Art, thought and aesthetics.', price: 269 },
      { number: 5, title: 'The Ailing Planet: The Green Movement’s Role', description: 'Environmental awareness and responsibility.', price: 269 },
      { number: 6, title: 'The Browning Version', description: 'Teacher-student relationships and self-esteem.', price: 269 },
      { number: 7, title: 'The Adventure', description: 'A reflective and philosophical journey.', price: 269 },
      { number: 8, title: 'Silk Road', description: 'Travel, discovery and personal growth.', price: 269 },
    ],
    'English - Hornbill - Poems': [
      { number: 1, title: 'A Photograph', description: 'Memory, love and loss in poetic form.', price: 269 },
      { number: 2, title: 'The Laburnum Top', description: 'Nature imagery and vitality.', price: 269 },
      { number: 3, title: 'The Voice of the Rain', description: 'Rain as a symbol of life and continuity.', price: 269 },
      { number: 4, title: 'Childhood', description: 'The loss of innocence and imagination.', price: 269 },
      { number: 5, title: 'Father to Son', description: 'Emotional distance and family bonds.', price: 269 },
    ],
    'English - Snapshots': [
      { number: 1, title: 'The Summer of the Beautiful White Horse', description: 'Honesty, family and morality.', price: 269 },
      { number: 2, title: 'The Address', description: 'Memory, displacement and loss.', price: 269 },
      { number: 3, title: 'Ranga’s Marriage', description: 'Village life and social customs.', price: 269 },
      { number: 4, title: 'Albert Einstein at School', description: 'A short narrative about a brilliant child.', price: 269 },
      { number: 5, title: "Mother's Day", description: 'Family dynamics and emotional tension.', price: 269 },
      { number: 6, title: 'The Ghat of the Only World', description: 'Memory of a father and historical context.', price: 269 },
      { number: 7, title: 'Birth', description: 'A narrative exploring new life and parenthood.', price: 269 },
      { number: 8, title: 'The Tale of Melon City', description: 'Political satire and absurd narrative.', price: 269 },
    ],
    'English - Core Skills': [
      { number: 1, title: 'Unseen Passage and Reading Skills', description: 'Build comprehension, interpretation and analysis skills.', price: 269 },
      { number: 2, title: 'Case-Based Factual Passage', description: 'Read and interpret data-rich factual texts.', price: 269 },
      { number: 3, title: 'Vocabulary and Note-Making', description: 'Extract key ideas and organise useful notes.', price: 269 },
      { number: 4, title: 'Summary Writing', description: 'Condense passages into accurate, clear summaries.', price: 269 },
      { number: 5, title: 'Tenses and Clauses', description: 'Apply core grammar structures accurately.', price: 269 },
      { number: 6, title: 'Re-ordering and Transformation', description: 'Practise sentence transformation and re-ordering.', price: 269 },
      { number: 7, title: 'Classified Advertisement', description: 'Write concise, well-structured classified advertisements.', price: 269 },
      { number: 8, title: 'Creative Writing Tasks', description: 'Prepare prescribed creative writing formats.', price: 269 },
    ],
  },
  12: {
    Physics: [
      { number: 1, title: 'Electric Charges and Fields', description: 'Coulomb’s law and field concept.', price: 269 },
      { number: 2, title: 'Electrostatic Potential and Capacitance', description: 'Potential energy and capacitor basics.', price: 269 },
      { number: 3, title: 'Current Electricity', description: 'Drift velocity and circuit analysis.', price: 269 },
      { number: 4, title: 'Moving Charges and Magnetism', description: 'Magnetic force and force on moving charges.', price: 269 },
      { number: 5, title: 'Magnetism and Matter', description: 'Magnetic properties and earth magnetism.', price: 269 },
      { number: 6, title: 'Electromagnetic Induction', description: 'Faraday and Lenz law applications.', price: 269 },
      { number: 7, title: 'Alternating Current', description: 'AC circuits, power and resonance.', price: 269 },
      { number: 8, title: 'Electromagnetic Waves', description: 'Propagation and spectrum of EM waves.', price: 269 },
      { number: 9, title: 'Ray Optics and Optical Instruments', description: 'Mirrors, lenses and optical devices.', price: 269 },
      { number: 10, title: 'Wave Optics', description: 'Interference, diffraction and polarisation.', price: 269 },
      { number: 11, title: 'Dual Nature of Radiation and Matter', description: 'Photoelectric effect and matter waves.', price: 269 },
      { number: 12, title: 'Atoms', description: 'Atomic structure and spectral lines.', price: 269 },
      { number: 13, title: 'Nuclei', description: 'Radioactivity and nuclear reactions.', price: 269 },
      { number: 14, title: 'Semiconductor Electronics', description: 'Diodes, transistors and logic circuits.', price: 269 },
    ],
    Chemistry: [
      { number: 1, title: 'Solutions', description: 'Different types of solutions and colligative properties.', price: 269 },
      { number: 2, title: 'Electrochemistry', description: 'Galvanic cells, electrolysis, and batteries.', price: 269 },
      { number: 3, title: 'Chemical Kinetics', description: 'Rate laws and reaction mechanisms.', price: 269 },
      { number: 4, title: 'd- and f-Block Elements', description: 'Transition elements and their properties.', price: 269 },
      { number: 5, title: 'Coordination Compounds', description: 'Complex compounds and ligand behaviour.', price: 269 },
      { number: 6, title: 'Haloalkanes and Haloarenes', description: 'Substitution reactions and nomenclature.', price: 269 },
      { number: 7, title: 'Alcohols, Phenols and Ethers', description: 'Organic functional groups and reactions.', price: 269 },
      { number: 8, title: 'Aldehydes, Ketones and Carboxylic Acids', description: 'Carbonyl chemistry and derivatives.', price: 269 },
      { number: 9, title: 'Amines', description: 'Amines, diazonium compounds and reactions.', price: 269 },
      { number: 10, title: 'Biomolecules', description: 'Carbohydrates, proteins and nucleic acids.', price: 269 },
    ],
    Mathematics: [
      { number: 1, title: 'Relations and Functions', description: 'Inverse functions and binary operations.', price: 269 },
      { number: 2, title: 'Inverse Trigonometric Functions', description: 'Principal values and inverse identities.', price: 269 },
      { number: 3, title: 'Matrices', description: 'Matrix algebra and determinants.', price: 269 },
      { number: 4, title: 'Determinants', description: 'Properties and area applications.', price: 269 },
      { number: 5, title: 'Continuity and Differentiability', description: 'Limits, continuity and derivability.', price: 269 },
      { number: 6, title: 'Applications of Derivatives', description: 'Rate of change and maxima/minima.', price: 269 },
      { number: 7, title: 'Integrals', description: 'Indefinite and definite integrals.', price: 269 },
      { number: 8, title: 'Applications of Integrals', description: 'Area under curves and practical uses.', price: 269 },
      { number: 9, title: 'Differential Equations', description: 'Formation and solution of differential equations.', price: 269 },
      { number: 10, title: 'Vector Algebra', description: 'Vectors, dot product and cross product.', price: 269 },
      { number: 11, title: 'Three-Dimensional Geometry', description: 'Lines and planes in 3D.', price: 269 },
      { number: 12, title: 'Linear Programming', description: 'Optimization problems and constraints.', price: 269 },
      { number: 13, title: 'Probability', description: 'Conditional probability and Bayes theorem.', price: 269 },
    ],
    'English - Flamingo - Prose': [
      { number: 1, title: 'The Last Lesson', description: 'Language, identity and loss of culture.', price: 269 },
      { number: 2, title: 'Lost Spring', description: 'Child labour and lost childhood.', price: 269 },
      { number: 3, title: 'Deep Water', description: 'Fear, overcoming obstacles and self-confidence.', price: 269 },
      { number: 4, title: 'The Rattrap', description: 'Redemption, trust and human change.', price: 269 },
      { number: 5, title: 'Indigo', description: 'Civil disobedience and social justice.', price: 269 },
      { number: 6, title: 'Poets and Pancakes', description: 'Humour and the film world in a satirical tone.', price: 269 },
      { number: 7, title: 'The Interview', description: 'Public identity and personal life.', price: 269 },
      { number: 8, title: 'Going Places', description: 'Dreams, imagination and self-belief.', price: 269 },
    ],
    'English - Flamingo - Poems': [
      { number: 1, title: 'My Mother at Sixty-Six', description: 'Aging, love and emotional vulnerability.', price: 269 },
      { number: 2, title: 'An Elementary School Classroom in a Slum', description: 'Inequality and the need for education.', price: 269 },
      { number: 3, title: 'Keeping Quiet', description: 'Silence, reflection and peace.', price: 269 },
      { number: 4, title: 'A Thing of Beauty', description: 'Beauty as a source of joy and hope.', price: 269 },
      { number: 5, title: 'A Roadside Stand', description: 'Economic hardship and rural inequality.', price: 269 },
      { number: 6, title: "Aunt Jennifer's Tigers", description: 'Creativity, oppression and freedom.', price: 269 },
    ],
    'English - Vistas': [
      { number: 1, title: 'The Third Level', description: 'Escapism, time and imagination.', price: 269 },
      { number: 2, title: 'The Tiger King', description: 'Satire on power and arrogance.', price: 269 },
      { number: 3, title: 'Journey to the End of the Earth', description: 'Nature, exploration and environmental concerns.', price: 269 },
      { number: 4, title: 'The Enemy', description: 'War, compassion and humanity.', price: 269 },
      { number: 5, title: 'Should Wizard Hit Mommy?', description: 'Parenting, imagination and moral confusion.', price: 269 },
      { number: 6, title: 'On the Face of It', description: 'Identity, acceptance and empathy.', price: 269 },
      { number: 7, title: 'Evans Tries an O-Level', description: 'Humour and prison escape plot.', price: 269 },
      { number: 8, title: 'Memories of Childhood', description: 'Reflections on childhood and injustice.', price: 269 },
    ],
    'English - Core Skills': [
      { number: 1, title: 'Unseen and Case-Based Reading', description: 'Build comprehension and interpretation skills.', price: 269 },
      { number: 2, title: 'Analysis, Inference and Vocabulary', description: 'Analyse texts and infer meaning from context.', price: 269 },
      { number: 3, title: 'Notice Writing', description: 'Write concise and complete notices.', price: 269 },
      { number: 4, title: 'Invitation and Reply', description: 'Prepare formal invitations and appropriate replies.', price: 269 },
      { number: 5, title: 'Letter Writing', description: 'Practise prescribed formal letter formats.', price: 269 },
      { number: 6, title: 'Article and Report Writing', description: 'Develop structured articles and reports.', price: 269 },
    ],
  },
}

type GeneratedQuiz = {
  chapter_name: string
  subject_name: string
  difficulty: string
  questions: { question: string; options: string[]; answer: string; explanation: string }[]
}

function App() {
  const location = useLocation()

  return (
    <div className="holo-shell min-h-screen bg-midnight text-white">
      <div className="relative overflow-hidden">
        <div className="hero-orb h-72 w-72 bg-sky-400 left-12 top-16" />
        <div className="hero-orb h-80 w-80 bg-violet-500 right-12 top-20" />
        <div className="hero-orb h-72 w-72 bg-emerald-400 left-1/3 bottom-0" />
        <SolarSystem />
        {location.pathname === '/' && <ChemistryLab />}

        <header className="glass sticky top-0 z-50 border-b border-white/10">
          <nav className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
            <Link to="/" className="text-xl font-bold tracking-[0.2em] text-sky-200">ADITYA</Link>
            <div className="hidden items-center gap-6 md:flex">
              <Link to="/">Home</Link>
              <Link to="/notes">Notes</Link>
              <Link to="/classes">Classes</Link>
              <Link to="/about">About</Link>
              <Link to="/contact">Contact</Link>
              <Link to="/login" className="rounded-full border border-sky-300/40 bg-sky-400/10 px-4 py-2">Login / Dashboard</Link>
              <Link to="/admin/login" className="rounded-full border border-fuchsia-300/40 bg-fuchsia-400/10 px-4 py-2 text-fuchsia-100">Admin Login</Link>
            </div>
            <div className="md:hidden text-sm">Menu</div>
          </nav>
        </header>

        <main className="mx-auto max-w-6xl px-6 pb-16 pt-14">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/notes" element={<NotesPage />} />
            <Route path="/classes" element={<ClassesPage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/login" element={<AuthPage />} />
            <Route path="/admin" element={<AdminPage />} />
            <Route path="/admin/login" element={<AdminPage />} />
            <Route path="/student/notes" element={<SecureNotesApp />} />
            <Route path="/student/notes/:chapterId/reader" element={<SecureReader />} />
          </Routes>
        </main>
      </div>
    </div>
  )
}

function SolarSystem() {
  return (
    <div className="solar-system" aria-hidden="true">
      <div className="solar-system__stars" />
      <div className="solar-system__sun"><span /></div>
      <div className="solar-system__orbit solar-system__orbit--one"><i className="solar-system__planet solar-system__planet--one" /></div>
      <div className="solar-system__orbit solar-system__orbit--two"><i className="solar-system__planet solar-system__planet--two" /></div>
      <div className="solar-system__orbit solar-system__orbit--three"><i className="solar-system__planet solar-system__planet--three"><b /></i></div>
      <div className="solar-system__orbit solar-system__orbit--four"><i className="solar-system__planet solar-system__planet--four" /></div>
      <div className="solar-system__orbit solar-system__orbit--five"><i className="solar-system__planet solar-system__planet--five"><b /></i></div>
    </div>
  )
}

function HomePage() {
  return (
    <section className="grid items-center gap-10 py-12 md:grid-cols-2">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
        <div className="inline-flex rounded-full border border-sky-300/30 bg-sky-400/10 px-4 py-2 text-xs uppercase tracking-[0.25em] text-sky-200">
          Class 9–12 Notes & Learning Platform
        </div>
        <div className="space-y-4">
          <h1 className="text-5xl font-black leading-tight md:text-6xl">ADITYA TUITION CENTRE</h1>
          <p className="max-w-lg text-lg text-slate-200">
            Premium educational notes, chapter-wise unlocks, and a student-first digital learning experience.
          </p>
          <p className="text-sky-200">Dehra Kuti, Garhmukteshwar</p>
          <div className="max-w-lg rounded-2xl border border-emerald-300/25 bg-emerald-400/5 px-5 py-4 shadow-[0_0_24px_rgba(52,211,153,0.08)]">
            <p className="text-xs uppercase tracking-[0.3em] text-emerald-200">Your next breakthrough starts here</p>
            <p className="mt-2 text-sm leading-6 text-slate-200">
              Every chapter you understand today builds the confidence you carry into tomorrow. Learn with focus, grow with consistency, and let your goals become your new standard.
            </p>
          </div>
        </div>
        <div className="flex flex-wrap gap-4">
          <Link to="/notes" className="rounded-full bg-gradient-to-r from-sky-400 to-violet-400 px-6 py-3 font-semibold text-slate-950 shadow-glow">Explore Notes</Link>
          <Link to="/notes" className="rounded-full border border-cyan-300/50 bg-cyan-400/10 px-6 py-3 font-semibold text-cyan-100 shadow-[0_0_24px_rgba(34,211,238,0.12)]">Take a Chapter Quiz</Link>
          <Link to="/login" className="rounded-full border border-white/20 bg-white/5 px-6 py-3 font-semibold">Login</Link>
          <Link to="/login" className="rounded-full border border-white/20 bg-white/5 px-6 py-3 font-semibold">Sign Up</Link>
          <Link to="/contact" className="rounded-full border border-white/20 bg-white/5 px-6 py-3 font-semibold">Contact Us</Link>
        </div>
      </motion.div>

      <motion.div initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} className="holo-panel relative mx-auto aspect-square w-full max-w-xl">
        <div className="glass card-3d absolute inset-0 rounded-[2rem] border border-white/20" />
        <div className="absolute inset-8 rounded-[2rem] border border-sky-300/20 bg-gradient-to-br from-sky-400/10 via-slate-900/10 to-violet-500/10 p-8">
          <div className="grid h-full gap-4 md:grid-cols-2">
            {classList.map((classNum) => (
              <div key={classNum} className="glass card-3d flex items-center justify-center rounded-2xl border border-white/10 p-6 text-center shadow-glow">
                <div>
                  <div className="text-2xl font-bold">Class {classNum}</div>
                  <div className="mt-2 text-xs uppercase tracking-[0.25em] text-sky-200">3D Explore</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </motion.div>

    </section>
  )
}

function ChemistryLab() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2, duration: 0.6 }}
      className="chemistry-lab"
    >
      <div className="chemistry-lab__heading">
        <span className="text-xs uppercase tracking-[0.35em] text-emerald-200">Holographic Chemistry Lab</span>
        <h2 className="mt-2 text-2xl font-black text-white">Explore. Experiment. Understand.</h2>
      </div>
      <div className="chemistry-lab__bottles" aria-hidden="true">
        <div className="chemistry-bottle chemistry-bottle--cyan"><div className="chemistry-bottle__neck"><i /></div><div className="chemistry-bottle__liquid"><b /><b /><b /></div><span>H₂O</span></div>
        <div className="chemistry-bottle chemistry-bottle--pink"><div className="chemistry-bottle__neck"><i /></div><div className="chemistry-bottle__liquid"><b /><b /><b /></div><span>NaCl</span></div>
        <div className="chemistry-bottle chemistry-bottle--lime"><div className="chemistry-bottle__neck"><i /></div><div className="chemistry-bottle__liquid"><b /><b /><b /></div><span>DNA</span></div>
      </div>
    </motion.div>
  )
}

function AdminPage() {
  const [email, setEmail] = useState('admin@adityatuition.in')
  const [password, setPassword] = useState('admin123')
  const [token, setToken] = useState(() => localStorage.getItem('admin_access_token') || '')
  const [stats, setStats] = useState({ users: 0, payments: 0 })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const API_BASE = import.meta.env.VITE_API_URL || '/api'

  const loadAdminSession = async (accessToken: string) => {
    const headers = { Authorization: `Bearer ${accessToken}` }
    const [usersResponse, paymentsResponse] = await Promise.all([
      fetch(`${API_BASE}/admin/users`, { headers }),
      fetch(`${API_BASE}/admin/payments`, { headers }),
    ])
    if (!usersResponse.ok || !paymentsResponse.ok) throw new Error('Admin access required.')
    const users = await usersResponse.json()
    const payments = await paymentsResponse.json()
    setStats({ users: users.length, payments: payments.length })
  }

  useEffect(() => {
    if (!token) return
    setLoading(true)
    loadAdminSession(token).catch(() => {
      localStorage.removeItem('admin_access_token')
      setToken('')
    }).finally(() => setLoading(false))
  }, [token])

  const handleLogin = async () => {
    setLoading(true)
    setError('')
    try {
      const response = await fetch(`${API_BASE}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      })
      const data = await response.json()
      if (!response.ok) throw new Error(data.detail || 'Invalid admin credentials')
      localStorage.setItem('admin_access_token', data.access_token)
      setToken(data.access_token)
    } catch (loginError) {
      setError(loginError instanceof Error ? loginError.message : 'Admin login failed')
      setLoading(false)
    }
  }

  if (token) {
    return (
      <section className="mx-auto max-w-4xl space-y-8 py-10">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div><p className="text-xs uppercase tracking-[0.3em] text-fuchsia-200">Protected session</p><h1 className="mt-2 text-4xl font-black">Admin Command Centre</h1></div>
          <button type="button" onClick={() => { localStorage.removeItem('admin_access_token'); setToken('') }} className="rounded-full border border-white/15 px-4 py-2 text-sm">Sign out</button>
        </div>
        <div className="grid gap-5 md:grid-cols-3">
          <div className="glass card-3d rounded-3xl p-6"><p className="text-xs uppercase tracking-[0.25em] text-cyan-200">Users</p><p className="mt-5 text-4xl font-black">{stats.users}</p></div>
          <div className="glass card-3d rounded-3xl p-6"><p className="text-xs uppercase tracking-[0.25em] text-fuchsia-200">Payments</p><p className="mt-5 text-4xl font-black">{stats.payments}</p></div>
          <div className="glass card-3d rounded-3xl p-6"><p className="text-xs uppercase tracking-[0.25em] text-emerald-200">Session</p><p className="mt-5 text-xl font-bold text-emerald-300">{loading ? 'Syncing...' : 'Verified'}</p></div>
        </div>
      </section>
    )
  }

  return (
    <section className="mx-auto max-w-lg py-10">
      <div className="glass rounded-[2rem] p-8">
        <p className="text-xs uppercase tracking-[0.3em] text-fuchsia-200">Private access</p>
        <h1 className="mt-3 text-3xl font-black">Admin Login</h1>
        <div className="mt-7 space-y-4">
          <input value={email} onChange={(event) => setEmail(event.target.value)} type="email" placeholder="Admin email" className="w-full rounded-2xl border border-white/10 bg-slate-950/40 px-4 py-3 text-white outline-none focus:border-fuchsia-300/60" />
          <input value={password} onChange={(event) => setPassword(event.target.value)} type="password" placeholder="Password" onKeyDown={(event) => { if (event.key === 'Enter') void handleLogin() }} className="w-full rounded-2xl border border-white/10 bg-slate-950/40 px-4 py-3 text-white outline-none focus:border-fuchsia-300/60" />
          <button type="button" onClick={() => void handleLogin()} disabled={loading} className="w-full rounded-2xl bg-gradient-to-r from-fuchsia-300 to-cyan-300 px-4 py-3 font-bold text-slate-950 disabled:opacity-60">{loading ? 'Verifying...' : 'Enter Admin'}</button>
        </div>
        <p className="mt-5 text-xs text-slate-400">Default ID: admin@adityatuition.in · Password: admin123</p>
        {error && <p className="mt-4 rounded-2xl border border-rose-300/30 bg-rose-400/10 p-3 text-sm text-rose-100">{error}</p>}
      </div>
    </section>
  )
}

function NotesPage() {
  const navigate = useNavigate()
  const [selectedClass, setSelectedClass] = useState<number>(9)
  const [selectedSubject, setSelectedSubject] = useState<string | null>(null)
  const [selectedChapter, setSelectedChapter] = useState<{ number: number; title: string; description: string; price: number } | null>(null)
  const [paymentStatus, setPaymentStatus] = useState<'idle' | 'paying' | 'success'>('idle')
  const [quiz, setQuiz] = useState<GeneratedQuiz | null>(null)
  const [quizLoading, setQuizLoading] = useState(false)
  const [quizError, setQuizError] = useState('')
  const [quizDifficulty, setQuizDifficulty] = useState<'easy' | 'medium' | 'hard'>('medium')
  const [quizAnswers, setQuizAnswers] = useState<Record<number, string>>({})
  const [showAnswerSheet, setShowAnswerSheet] = useState(false)
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const updateDeviceType = () => {
      const mobile = window.innerWidth < 768 || window.matchMedia('(pointer: coarse)').matches
      setIsMobile(mobile)
    }

    updateDeviceType()
    window.addEventListener('resize', updateDeviceType)
    return () => window.removeEventListener('resize', updateDeviceType)
  }, [])

  const subjectList = Object.keys(notesData[selectedClass] ?? {})
  const chapterList = selectedSubject ? notesData[selectedClass]?.[selectedSubject] ?? [] : []

  const paymentUpi = selectedChapter ? `upi://pay?pa=336461816324430@cnrb&pn=Aditya%20Tuition%20Centre&am=${selectedChapter.price}&cu=INR&tn=${encodeURIComponent(selectedChapter.title)}` : ''
  const paymentQrUrl = selectedChapter ? `https://api.qrserver.com/v1/create-qr-code/?data=${encodeURIComponent(paymentUpi)}` : ''

  const handleOpenSecureNotes = () => {
    const token = localStorage.getItem('access_token')
    if (!token) {
      navigate('/login')
      return
    }

    navigate('/student/notes')
  }

  const handlePayNow = () => {
    if (!selectedChapter) return

    setPaymentStatus('paying')
    if (isMobile) {
      window.location.href = paymentUpi
      return
    }
    setPaymentStatus('idle')
  }

  const handlePaymentSuccess = () => {
    setPaymentStatus('success')
  }

  const handleGenerateQuiz = async () => {
    if (!selectedChapter || !selectedSubject) return
    const API_BASE = import.meta.env.VITE_API_URL || '/api'
    setQuizLoading(true)
    setQuizError('')
    setQuiz(null)
    setQuizAnswers({})
    setShowAnswerSheet(false)
    try {
      const response = await fetch(`${API_BASE}/quizzes/generate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          class_number: selectedClass,
          subject_name: selectedSubject,
          chapter_number: selectedChapter.number,
          chapter_name: selectedChapter.title,
          question_count: 25,
          difficulty: quizDifficulty,
        }),
      })
      const data = await response.json()
      if (!response.ok) throw new Error(data.detail || 'Quiz generation failed.')
      setQuiz(data)
    } catch (error) {
      setQuizError(error instanceof Error ? error.message : 'Quiz generation failed.')
    } finally {
      setQuizLoading(false)
    }
  }

  return (
    <section className="space-y-8 py-10">
      <div className="flex items-center justify-between gap-3">
        <h2 className="text-3xl font-bold">Notes</h2>
        <Link to="/classes" className="rounded-full border border-white/15 px-4 py-2 text-sm">Back to Classes</Link>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {classList.map((classNum) => (
          <button
            key={classNum}
            type="button"
            onClick={() => {
              setSelectedClass(classNum)
              setSelectedSubject(null)
              setSelectedChapter(null)
            }}
            className={`glass card-3d rounded-3xl p-5 text-left ${selectedClass === classNum ? 'border-sky-300/40 ring-1 ring-sky-300/40' : ''}`}
          >
            <div className="text-xs uppercase tracking-[0.25em] text-sky-200">Class {classNum}</div>
            <h3 className="mt-8 text-2xl font-bold">Explore</h3>
            <p className="mt-2 text-sm text-slate-300">{Object.keys(notesData[classNum] ?? {}).length} subjects</p>
          </button>
        ))}
      </div>

      {subjectList.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-xl font-semibold">Select Subject</h3>
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {subjectList.map((subject) => (
              <div key={subject} className={`glass card-3d rounded-3xl p-5 ${selectedSubject === subject ? 'border-violet-300/40 ring-1 ring-violet-300/40' : ''}`}>
                <button
                  type="button"
                  onClick={() => {
                    setSelectedSubject(subject)
                    setSelectedChapter(null)
                  }}
                  className="w-full text-left"
                >
                  <div className="text-xs uppercase tracking-[0.25em] text-violet-200">{subject}</div>
                  <div className="mt-8 text-2xl font-bold">{(notesData[selectedClass]?.[subject] ?? []).length}</div>
                  <div className="mt-2 text-sm text-slate-300">chapters</div>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setSelectedSubject(subject)
                    setSelectedChapter(null)
                  }}
                  className="mt-5 w-full rounded-xl border border-cyan-300/30 bg-cyan-400/10 px-3 py-2 text-sm font-semibold text-cyan-100"
                >
                  Quiz for this subject
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {selectedSubject && chapterList.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-xl font-semibold">{selectedSubject} Chapters</h3>
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {chapterList.map((chapter) => (
              <button
                key={`${selectedSubject}-${chapter.number}`}
                type="button"
                onClick={() => setSelectedChapter(chapter)}
                className="glass card-3d rounded-3xl p-5 text-left"
              >
                <div className="text-xs uppercase tracking-[0.25em] text-sky-200">Chapter {chapter.number}</div>
                <h4 className="mt-6 text-xl font-bold">{chapter.title}</h4>
                <p className="mt-2 text-sm text-slate-300">{chapter.description}</p>
                <div className="mt-5 flex items-center justify-between gap-3 text-sm">
                  <span className="font-semibold text-emerald-300">₹{chapter.price}</span>
                  <span className="font-semibold text-cyan-200">25-question quiz</span>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {selectedChapter && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 p-4 backdrop-blur-sm">
          <div className="glass w-full max-w-xl rounded-[2rem] border border-white/10 p-6">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs uppercase tracking-[0.25em] text-sky-200">{selectedSubject}</p>
                <h3 className="mt-2 text-2xl font-bold">Chapter {selectedChapter.number}: {selectedChapter.title}</h3>
              </div>
              <button type="button" onClick={() => {
                setSelectedChapter(null)
                setPaymentStatus('idle')
              }} className="rounded-full border border-white/15 px-3 py-1 text-sm">Close</button>
            </div>
            <p className="mt-4 text-sm text-slate-200">{selectedChapter.description}</p>
            <div className="mt-6 flex items-center justify-between rounded-2xl border border-white/10 bg-slate-950/30 px-4 py-3">
              <span className="text-sm text-slate-300">Price</span>
              <span className="text-xl font-bold text-emerald-300">₹{selectedChapter.price}</span>
            </div>

            {paymentStatus === 'success' && (
              <div className="mt-6 rounded-2xl border border-emerald-400/40 bg-emerald-500/10 p-4 text-sm text-emerald-100">
                Payment started successfully. Your chapter is ready to unlock in the secure notes area.
              </div>
            )}

            {paymentStatus === 'paying' && (
              <div className="mt-6 rounded-2xl border border-sky-300/40 bg-sky-500/10 p-4 text-sm text-sky-100">
                {isMobile
                  ? 'Opening PhonePe. Complete the UPI payment, then return here to unlock the chapter.'
                  : 'Scan this QR using PhonePe, GPay, Paytm, or any UPI app to complete the payment.'}
              </div>
            )}

            {!isMobile && selectedChapter && (
              <div className="mt-6 rounded-2xl border border-white/10 bg-slate-950/30 p-4">
                <div className="mb-3 text-xs uppercase tracking-[0.25em] text-sky-200">Desktop QR Payment</div>
                <div className="flex flex-col items-center gap-4 md:flex-row md:items-center md:justify-center">
                  <div className="rounded-2xl border border-white/10 bg-white p-3 shadow-lg shadow-sky-500/20">
                    <img src={paymentQrUrl} alt="PhonePe payment QR code" className="h-44 w-44 rounded-xl object-contain" />
                  </div>
                  <div className="text-center md:text-left">
                    <div className="text-sm text-slate-300">UPI ID</div>
                    <div className="mt-2 text-lg font-bold text-sky-200">336461816324430@cnrb</div>
                    <div className="mt-2 text-sm text-slate-300">Amount: ₹{selectedChapter.price}</div>
                    <div className="mt-2 text-xs uppercase tracking-[0.25em] text-violet-200">Pay securely</div>
                  </div>
                </div>
              </div>
            )}

            {isMobile && selectedChapter && (
              <div className="mt-6 rounded-2xl border border-emerald-400/30 bg-emerald-500/5 p-4">
                <div className="text-xs uppercase tracking-[0.25em] text-emerald-200">Phone / Tablet Payment</div>
                <div className="mt-3 text-sm text-slate-200">Use the PhonePe button to open the app instantly and complete payment.</div>
                <div className="mt-4 flex items-center justify-between rounded-xl border border-white/10 bg-slate-950/30 px-3 py-2 text-sm">
                  <span className="text-slate-300">UPI ID</span>
                  <span className="font-semibold text-emerald-300">336461816324430@cnrb</span>
                </div>
              </div>
            )}

            <div className="mt-6 flex flex-wrap justify-end gap-3">
              <button type="button" onClick={() => {
                setSelectedChapter(null)
                setPaymentStatus('idle')
              }} className="rounded-full border border-white/10 px-4 py-2">Cancel</button>
              <button type="button" onClick={handlePayNow} className="rounded-full border border-emerald-300/40 bg-emerald-400/10 px-4 py-2 font-semibold text-emerald-100">
                {isMobile ? `Open PhonePe • ₹${selectedChapter.price}` : `Generate QR • ₹${selectedChapter.price}`}
              </button>
              <button type="button" onClick={() => {
                handlePaymentSuccess()
                handleOpenSecureNotes()
              }} className="rounded-full bg-gradient-to-r from-sky-400 to-violet-400 px-4 py-2 font-semibold text-slate-950">Open Secure Notes</button>
              <button type="button" onClick={() => void handleGenerateQuiz()} disabled={quizLoading} className="rounded-full border border-cyan-300/40 bg-cyan-400/10 px-4 py-2 font-semibold text-cyan-100 disabled:opacity-60">
                {quizLoading ? 'Generating...' : 'Generate Google Quiz'}
              </button>
            </div>
            {quizError && <p className="mt-4 rounded-2xl border border-rose-300/30 bg-rose-400/10 p-3 text-sm text-rose-100">{quizError}</p>}
            <div className="mt-5 grid gap-3 sm:grid-cols-2">
              <label className="text-sm text-slate-300">Difficulty
                <select value={quizDifficulty} onChange={(event) => setQuizDifficulty(event.target.value as typeof quizDifficulty)} className="mt-2 w-full rounded-xl border border-white/10 bg-slate-950/50 px-3 py-2 text-white">
                  <option value="easy">Easy</option>
                  <option value="medium">Medium</option>
                  <option value="hard">Hard</option>
                </select>
              </label>
              <div className="rounded-xl border border-cyan-300/20 bg-cyan-400/5 px-3 py-2 text-sm text-cyan-100">Exactly 25 questions from this chapter</div>
            </div>
          </div>
        </div>
      )}

      {quiz && (
        <div className="fixed inset-0 z-[60] overflow-y-auto bg-slate-950/90 p-4 backdrop-blur-sm">
          <div className="mx-auto my-8 max-w-3xl rounded-[2rem] border border-cyan-300/20 bg-slate-900 p-6 shadow-2xl">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs uppercase tracking-[0.25em] text-cyan-200">Google generated quiz · {quiz.difficulty}</p>
                <h3 className="mt-2 text-2xl font-bold">{quiz.chapter_name}</h3>
              </div>
              <button type="button" onClick={() => setQuiz(null)} className="rounded-full border border-white/15 px-3 py-1 text-sm">Close</button>
            </div>
            <div className="mt-5 flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-white/10 bg-slate-950/40 p-4">
              <div className="text-sm text-slate-300">25 questions · Select an option to check your response.</div>
              <button type="button" onClick={() => setShowAnswerSheet((current) => !current)} className="rounded-xl border border-emerald-300/40 bg-emerald-400/10 px-3 py-2 text-sm font-semibold text-emerald-100">
                {showAnswerSheet ? 'Hide Answer Sheet' : 'Show Answer Sheet'}
              </button>
            </div>
            {showAnswerSheet && (
              <div className="mt-5 rounded-2xl border border-emerald-300/20 bg-emerald-400/5 p-5">
                <h4 className="text-lg font-bold text-emerald-100">Answer Sheet</h4>
                <div className="mt-4 grid gap-3 md:grid-cols-2">
                  {quiz.questions.map((question, index) => (
                    <div key={`answer-${index}`} className="rounded-xl border border-white/10 bg-slate-950/30 p-3 text-sm">
                      <div className="font-semibold">{index + 1}. {question.answer}</div>
                      <div className="mt-1 text-slate-300">{question.explanation}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}
            <div className="mt-6 space-y-5">
              {quiz.questions.map((question, index) => {
                const selectedAnswer = quizAnswers[index]
                return (
                  <div key={`${index}-${question.question}`} className="rounded-2xl border border-white/10 bg-slate-950/40 p-5">
                    <p className="font-semibold">{index + 1}. {question.question}</p>
                    <div className="mt-4 grid gap-2 md:grid-cols-2">
                      {question.options.map((option) => {
                        const isSelected = selectedAnswer === option
                        const isCorrect = selectedAnswer && option === question.answer
                        const isWrong = isSelected && option !== question.answer
                        return (
                          <button key={option} type="button" onClick={() => setQuizAnswers((current) => ({ ...current, [index]: option }))} className={`rounded-xl border px-3 py-2 text-left text-sm ${isCorrect ? 'border-emerald-300/60 bg-emerald-400/15 text-emerald-100' : isWrong ? 'border-rose-300/60 bg-rose-400/15 text-rose-100' : isSelected ? 'border-cyan-300/60 bg-cyan-400/15' : 'border-white/10 bg-white/5'}`}>
                            {option}
                          </button>
                        )
                      })}
                    </div>
                    {selectedAnswer && <p className="mt-4 text-sm text-slate-300"><span className="font-semibold text-cyan-200">Explanation:</span> {question.explanation}</p>}
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      )}
    </section>
  )
}

function ClassesPage() {
  const [selectedClass, setSelectedClass] = useState<number | null>(null)
  const activeClass = selectedClass ? classDetails[selectedClass as keyof typeof classDetails] : null

  return (
    <section className="space-y-8 py-10">
      <h2 className="text-3xl font-bold">Classes</h2>
      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
        {classList.map((classNum) => (
          <button
            key={classNum}
            type="button"
            onClick={() => setSelectedClass(classNum)}
            className="glass card-3d rounded-3xl p-6 text-left"
          >
            <div className="text-xs uppercase tracking-[0.25em] text-violet-200">Class {classNum}</div>
            <div className="mt-12 text-center text-4xl font-black">{classNum}</div>
            <div className="mt-12 text-center text-sm uppercase tracking-[0.25em] text-sky-200">Explore</div>
          </button>
        ))}
      </div>

      {activeClass && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 p-4 backdrop-blur-sm">
          <div className="glass w-full max-w-xl rounded-[2rem] border border-white/10 p-6">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs uppercase tracking-[0.25em] text-sky-200">Academic section</p>
                <h3 className="mt-2 text-3xl font-bold">{activeClass.title}</h3>
              </div>
              <button
                type="button"
                onClick={() => setSelectedClass(null)}
                className="rounded-full border border-white/15 px-3 py-1 text-sm"
              >
                Close
              </button>
            </div>

            <p className="mt-4 text-sm text-slate-200">{activeClass.description}</p>

            <div className="mt-6 grid gap-2 sm:grid-cols-2">
              {activeClass.subjects.map((subject) => (
                <div key={subject} className="rounded-2xl border border-sky-300/20 bg-sky-400/5 px-3 py-2 text-sm text-slate-100">
                  {subject}
                </div>
              ))}
            </div>

            <div className="mt-6 flex justify-end gap-3">
              <button type="button" onClick={() => setSelectedClass(null)} className="rounded-full border border-white/10 px-4 py-2">
                Cancel
              </button>
              <Link to="/notes" onClick={() => setSelectedClass(null)} className="rounded-full bg-gradient-to-r from-sky-400 to-violet-400 px-4 py-2 font-semibold text-slate-950">
                Open Notes
              </Link>
            </div>
          </div>
        </div>
      )}
    </section>
  )
}

function AboutPage() {
  return (
    <section className="py-10">
      <h2 className="text-3xl font-bold">About Aditya Tuition Centre</h2>
      <div className="glass mt-6 rounded-3xl p-8 text-slate-200">
        We provide premium notes and guided learning support for classes 9 to 12, with chapter access, secure verification, and a structured academic experience for students.
      </div>
    </section>
  )
}

function ContactPage() {
  return (
    <section className="py-10">
      <h2 className="text-3xl font-bold">Contact</h2>
      <div className="glass mt-6 rounded-3xl p-8">
        <p className="text-xl font-semibold">Aditya Tuition Centre</p>
        <p className="mt-3 text-slate-200">Location: Dehra Kuti, Garhmukteshwar, Uttar Pradesh</p>
        <p className="mt-2 text-slate-200">Contact: +91 87555 40381</p>
        <div className="mt-5 flex flex-wrap gap-3">
          <a href="tel:+918755540381" className="rounded-full bg-sky-400 px-5 py-3 font-semibold text-slate-950">Call Now</a>
          <a href="mailto:adityalibrary319@gmail.com" className="rounded-full border border-white/20 px-5 py-3">Contact</a>
          <Link to="/notes" className="rounded-full border border-white/20 px-5 py-3">Explore Notes</Link>
        </div>
      </div>
    </section>
  )
}

function AuthPage() {
  const [isLogin, setIsLogin] = useState(true)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [message, setMessage] = useState<{ type: 'success' | 'error' | 'info'; text: string }>({ type: 'info', text: '' })
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    const token = localStorage.getItem('access_token')
    if (token) {
      setMessage({ type: 'success', text: 'Logged in. You can access the secure notes dashboard.' })
    }
  }, [])

  const validateForm = (mode: 'login' | 'signup') => {
    if (!email.trim() || !password.trim()) {
      throw new Error('Email and password are required.')
    }

    if (mode === 'signup') {
      if (!name.trim()) {
        throw new Error('Full name is required for sign up.')
      }
      if (!phone.trim()) {
        throw new Error('Phone number is required for sign up.')
      }
    }
  }

  const handleAuth = async (mode: 'login' | 'signup') => {
    try {
      validateForm(mode)
      setIsLoading(true)
      setMessage({ type: 'info', text: mode === 'login' ? 'Verifying your login details...' : 'Creating your secure account...' })

      const API_BASE = import.meta.env.VITE_API_URL;

      const endpoint = mode === 'login'
        ? `${API_BASE}/auth/login`
        : `${API_BASE}/auth/signup`;
      const payload = mode === 'login'
        ? { email, password }
        : { name, email, phone, password, confirm_password: password }

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })

      const data = await response.json()
      if (!response.ok) {
        throw new Error(data.detail || (mode === 'login' ? 'Login failed' : 'Signup failed'))
      }

      if (mode === 'login') {
        localStorage.setItem('access_token', data.access_token)
        localStorage.setItem('user_id', String(data.user_id || 'student'))
        setMessage({ type: 'success', text: 'Login successful. Redirecting to secure notes...' })
        window.location.href = '/student/notes'
        return
      }

      setMessage({ type: 'success', text: 'Account created successfully. Please login to continue.' })
      setIsLogin(true)
      setPassword('')
      setName('')
      setPhone('')
    } catch (error) {
      setMessage({ type: 'error', text: error instanceof Error ? error.message : 'Authentication failed' })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <section className="mx-auto max-w-xl py-12">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, ease: 'easeOut' }}
        className="glass rounded-[2rem] p-8 shadow-glow"
      >
        <div className="flex rounded-full border border-white/10 bg-slate-950/30 p-1">
          <button
            type="button"
            onClick={() => setIsLogin(true)}
            className={`flex-1 rounded-full px-4 py-2 text-sm font-semibold transition ${isLogin ? 'bg-gradient-to-r from-sky-400 to-violet-400 text-slate-950' : 'text-slate-300'}`}
          >
            Login
          </button>
          <button
            type="button"
            onClick={() => setIsLogin(false)}
            className={`flex-1 rounded-full px-4 py-2 text-sm font-semibold transition ${!isLogin ? 'bg-gradient-to-r from-sky-400 to-violet-400 text-slate-950' : 'text-slate-300'}`}
          >
            Sign Up
          </button>
        </div>

        <motion.div
          key={isLogin ? 'login' : 'signup'}
          initial={{ opacity: 0, x: 12 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.25 }}
          className="mt-6 space-y-4"
        >
          {!isLogin && (
            <>
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full rounded-2xl border border-white/10 bg-slate-950/30 px-4 py-3 text-white placeholder:text-slate-400 outline-none transition focus:border-sky-300/50"
                placeholder="Full name"
                autoComplete="name"
              />
              <input
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full rounded-2xl border border-white/10 bg-slate-950/30 px-4 py-3 text-white placeholder:text-slate-400 outline-none transition focus:border-sky-300/50"
                placeholder="Phone"
                autoComplete="tel"
              />
            </>
          )}

          <input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full rounded-2xl border border-white/10 bg-slate-950/30 px-4 py-3 text-white placeholder:text-slate-400 outline-none transition focus:border-sky-300/50"
            placeholder="Email"
            type="email"
            autoComplete="email"
          />
          <input
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            type="password"
            className="w-full rounded-2xl border border-white/10 bg-slate-950/30 px-4 py-3 text-white placeholder:text-slate-400 outline-none transition focus:border-sky-300/50"
            placeholder="Password"
            autoComplete={isLogin ? 'current-password' : 'new-password'}
          />

          <motion.button
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
            type="button"
            onClick={() => handleAuth(isLogin ? 'login' : 'signup')}
            disabled={isLoading}
            className="w-full rounded-2xl bg-gradient-to-r from-sky-400 to-violet-400 px-4 py-3 font-semibold text-slate-950 shadow-glow disabled:cursor-not-allowed disabled:opacity-80"
          >
            {isLoading ? (isLogin ? 'Verifying...' : 'Creating account...') : (isLogin ? 'Login' : 'Create Account')}
          </motion.button>
        </motion.div>

        {message.text && (
          <div
            className={`mt-5 rounded-2xl border px-4 py-3 text-sm ${
              message.type === 'success'
                ? 'border-emerald-400/40 bg-emerald-500/10 text-emerald-100'
                : message.type === 'error'
                  ? 'border-rose-400/40 bg-rose-500/10 text-rose-100'
                  : 'border-sky-300/20 bg-sky-400/5 text-sky-100'
            }`}
          >
            {message.text}
          </div>
        )}
        <div className="mt-5 text-center text-sm text-slate-400">
          <Link to="/admin" className="text-fuchsia-200 transition hover:text-fuchsia-100">Admin session login</Link>
        </div>
      </motion.div>
    </section>
  )
}

export default App
