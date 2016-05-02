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
    "WX2UTF_U",
    "LexicalTransfer",
    "Transliteration",
    "UTF2WX",
    "AgreementFeature",
    "InterChunk",
    "IntraChunk",
    "DefaultFeatures",
    "WordGenerator",
    "WX2UTF"
);

my $langpair_obj = new_translator ILMT::Translator("URD", "HIN", \@seq);
