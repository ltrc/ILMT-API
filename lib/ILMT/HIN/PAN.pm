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
    "ComputeHead",
    "ComputeVibhakti",
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
    "DefaultFeatures",
    "WordGenerator"
);

my $langpair_obj = new_translator ILMT::Translator("HIN", "PAN", \@seq);
