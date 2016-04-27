package ILMT::HIN::URD;
use strict;
use warnings;
use Data::Dumper;
use ILMT::Translator;

my @seq = (
    "Tokenizer",
    "UTF2WX",
    "Morph",
    "POSTagger",
    "Prune",
    "PickOneMorph",
    "Chunker",
    "MWE",
    "NER",
    "Merger",
    "ComputeHead",
    "WX2UTF",
    "LexicalTransfer",
    "Transliteration",
    "UTF2WX_U",
    "AgreementFeature"
);

my $langpair_obj = new_translator ILMT::Translator("HIN", "URD", \@seq);
