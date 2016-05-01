package ILMT::URD::HIN;
use strict;
use warnings;
use Data::Dumper;
use ILMT::Translator;

my @seq = (
    "Tokenizer",
    "UTF2WX_U",
    "Morph",
    "WX2UTF_U",
    "POSTagger",
    "UTF2WX_U",
    "Chunker",
    "Prune",
    "PickOneMorph",
    "ComputeHead",
    "WX2UTF_U"
);

my $langpair_obj = new_translator ILMT::Translator("URD", "HIN", \@seq);
