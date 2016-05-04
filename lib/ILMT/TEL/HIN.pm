package ILMT::TEL::HIN;
use strict;
use warnings;
use Data::Dumper;
use ILMT::Translator;

my @seq = (
    "Tokenizer",
    "UTF2WX",
    "Morph"
);

my $langpair_obj = new_translator ILMT::Translator("TEL", "HIN", \@seq);
