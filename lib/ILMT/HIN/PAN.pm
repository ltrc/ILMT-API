package ILMT::HIN::PAN;
use strict;
use warnings;
use Data::Dumper;
use ILMT::Translator;

my @seq = (
    "Tokenizer",
    "UTF2WX",
    "Morph",
    "POSTagger",
    "Chunker",
    "Prune",
    "GuessMorph",
    "PickOneMorph",
    "HeadComputation",
    "VibhaktiComputation",
    "SimpleParser",
    "Root2Infinity",
    "TransferGrammar",
    "WX2UTF",
    "LexicalTransfer",
    "Transliteration",
    "AgreementFeature",
    "VibhaktiSplitter",
    "InterChunk",
    "IntraChunk",
    "AgreementDistribution",
    "DefaultFeatures"
);

my $langpair_obj = new_translator ILMT::Translator("HIN", "PAN", \@seq);
